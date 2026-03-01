import fs from "node:fs/promises";
import path from "node:path";
import type { DocsConfig, DocsPage, DocsSection, DocsSubsection } from "./types";

const CONFIG_FILENAME = "docs-config.yaml";

function assertNonEmptyString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid docs config: ${label} must be a non-empty string.`);
  }
}

function validateConfig(raw: unknown): DocsConfig {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid docs config: expected an object.");
  }

  const site = (raw as any).site;
  assertNonEmptyString(site?.title, "site.title");

  const sections = (raw as any).sections;
  if (!Array.isArray(sections) || sections.length === 0) {
    throw new Error("Invalid docs config: sections must be a non-empty array.");
  }

  const parsedSections: DocsSection[] = sections.map((section, sectionIndex) => {
    assertNonEmptyString(section?.id, `sections[${sectionIndex}].id`);
    assertNonEmptyString(section?.title, `sections[${sectionIndex}].title`);

    const subsections = section?.sections;
    if (!Array.isArray(subsections) || subsections.length === 0) {
      throw new Error(`Invalid docs config: sections[${sectionIndex}].sections must be a non-empty array.`);
    }

    const parsedSubsections: DocsSubsection[] = subsections.map((subsection, subsectionIndex) => {
      assertNonEmptyString(subsection?.id, `sections[${sectionIndex}].sections[${subsectionIndex}].id`);
      assertNonEmptyString(subsection?.title, `sections[${sectionIndex}].sections[${subsectionIndex}].title`);

      const pages = subsection?.pages;
      if (!Array.isArray(pages) || pages.length === 0) {
        throw new Error(
          `Invalid docs config: sections[${sectionIndex}].sections[${subsectionIndex}].pages must be a non-empty array.`,
        );
      }

      const parsedPages: DocsPage[] = pages.map((page, pageIndex) => {
        assertNonEmptyString(
          page?.title,
          `sections[${sectionIndex}].sections[${subsectionIndex}].pages[${pageIndex}].title`,
        );
        assertNonEmptyString(
          page?.slug,
          `sections[${sectionIndex}].sections[${subsectionIndex}].pages[${pageIndex}].slug`,
        );
        assertNonEmptyString(
          page?.file,
          `sections[${sectionIndex}].sections[${subsectionIndex}].pages[${pageIndex}].file`,
        );

        return {
          title: page.title,
          slug: page.slug.replace(/^\//, "").replace(/\/$/, ""),
          file: page.file,
          description: typeof page.description === "string" ? page.description : undefined,
        };
      });

      return {
        id: subsection.id,
        title: subsection.title,
        pages: parsedPages,
      };
    });

    return { id: section.id, title: section.title, sections: parsedSubsections };
  });

  const seenSlugs = new Set<string>();
  for (const section of parsedSections) {
    for (const subsection of section.sections) {
      for (const page of subsection.pages) {
        if (seenSlugs.has(page.slug)) {
          throw new Error(`Invalid docs config: duplicate slug "${page.slug}".`);
        }
        seenSlugs.add(page.slug);
      }
    }
  }

  return {
    site: {
      title: site.title,
      product: typeof site.product === "string" ? site.product : undefined,
      description: typeof site.description === "string" ? site.description : undefined,
    },
    sections: parsedSections,
  };
}

export async function loadDocsConfig(): Promise<DocsConfig> {
  const configPath = path.join(process.cwd(), CONFIG_FILENAME);
  const content = await fs.readFile(configPath, "utf8");
  const parsed = parseYaml(content);
  return validateConfig(parsed);
}

export function flattenDocsPages(config: DocsConfig): Array<{ section: DocsSection; subsection: DocsSubsection; page: DocsPage }> {
  const pages: Array<{ section: DocsSection; subsection: DocsSubsection; page: DocsPage }> = [];
  for (const section of config.sections) {
    for (const subsection of section.sections) {
      for (const page of subsection.pages) {
        pages.push({ section, subsection, page });
      }
    }
  }
  return pages;
}

export function getSectionFirstPage(section: DocsSection): DocsPage | null {
  const subsection = section.sections[0];
  if (!subsection) return null;
  return subsection.pages[0] ?? null;
}

export function findDocsPage(
  config: DocsConfig,
  slug: string,
): { section: DocsSection; subsection: DocsSubsection; page: DocsPage } | null {
  for (const section of config.sections) {
    for (const subsection of section.sections) {
      const page = subsection.pages.find((p) => p.slug === slug);
      if (page) return { section, subsection, page };
    }
  }
  return null;
}

function parseYaml(input: string): unknown {
  // Minimal YAML parser for this repo’s docs-config.yaml shape:
  // - objects
  // - arrays via `-`
  // - strings/numbers/bools/null
  // - indentation-based nesting
  //
  // This avoids pulling additional dependencies in a network-restricted environment.
  type Frame = { indent: number; container: any; kind: "object" | "array" };

  const root: any = {};
  const stack: Frame[] = [{ indent: -1, container: root, kind: "object" }];

  const lines = input.replace(/\r\n/g, "\n").split("\n");

  function parseScalar(raw: string): any {
    const value = raw.trim();
    if (value === "null" || value === "~") return null;
    if (value === "true") return true;
    if (value === "false") return false;
    if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
    if (value === "[]") return [];
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      return value.slice(1, -1);
    }
    return value;
  }

  function currentFrame() {
    return stack[stack.length - 1]!;
  }

  const nextContentLine = (fromIndex: number) => {
    for (let i = fromIndex; i < lines.length; i++) {
      const raw = lines[i] ?? "";
      const trimmed = raw.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const indent = raw.match(/^ */)?.[0]?.length ?? 0;
      return { indent, trimmed };
    }
    return null;
  };

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index] ?? "";
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const indent = line.match(/^ */)?.[0]?.length ?? 0;

    while (stack.length > 1 && indent <= currentFrame().indent) stack.pop();
    const frame = currentFrame();

    const isArrayItem = trimmed.startsWith("- ");
    if (isArrayItem) {
      if (frame.kind !== "array") {
        throw new Error("Invalid docs config: unexpected array item.");
      }
      const rest = trimmed.slice(2);
      if (!rest) {
        const obj: any = {};
        frame.container.push(obj);
        stack.push({ indent, container: obj, kind: "object" });
        continue;
      }
      if (rest.includes(":")) {
        const obj: any = {};
        frame.container.push(obj);
        stack.push({ indent, container: obj, kind: "object" });
        // Fall through to parse key/value on the same line.
        const kv = rest;
        const idx = kv.indexOf(":");
        const key = kv.slice(0, idx).trim();
        const valueRaw = kv.slice(idx + 1).trim();
        if (!valueRaw) {
          const next = nextContentLine(index + 1);
          if (next && next.indent > indent && next.trimmed.startsWith("- ")) {
            obj[key] = [];
            stack.push({ indent, container: obj[key], kind: "array" });
          } else {
            obj[key] = {};
            stack.push({ indent, container: obj[key], kind: "object" });
          }
        } else {
          obj[key] = parseScalar(valueRaw);
        }
        continue;
      }
      frame.container.push(parseScalar(rest));
      continue;
    }

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) {
      throw new Error(`Invalid docs config: expected key/value, got "${trimmed}".`);
    }

    const key = trimmed.slice(0, colonIndex).trim();
    const valueRaw = trimmed.slice(colonIndex + 1).trim();

    if (frame.kind !== "object") {
      throw new Error("Invalid docs config: expected object key/value.");
    }

    if (!valueRaw) {
      const next = nextContentLine(index + 1);
      if (next && next.indent > indent && next.trimmed.startsWith("- ")) {
        frame.container[key] = [];
        stack.push({ indent, container: frame.container[key], kind: "array" });
      } else {
        frame.container[key] = {};
        stack.push({ indent, container: frame.container[key], kind: "object" });
      }
      continue;
    }

    frame.container[key] = parseScalar(valueRaw);
  }

  return root;
}
