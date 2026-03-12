import fs from "node:fs/promises";
import path from "node:path";
import type { DocsConfig, DocsLinkItem, DocsPage, DocsSection, DocsTab, DocsVersion } from "./types";

const CONFIG_FILENAME = "docs-config.yaml";

function assertNonEmptyString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid docs config: ${label} must be a non-empty string.`);
  }
}

function parseTabs(rawTabs: unknown, label: string): DocsTab[] | undefined {
  if (rawTabs == null) return undefined;
  if (!Array.isArray(rawTabs)) {
    throw new Error(`Invalid docs config: ${label} must be an array.`);
  }

  return rawTabs.map((tab, index) => {
    assertNonEmptyString(tab?.title, `${label}[${index}].title`);
    assertNonEmptyString(tab?.href, `${label}[${index}].href`);

    return {
      title: tab.title,
      href: tab.href,
    };
  });
}

function parsePrimaryLinks(rawLinks: unknown, label: string): DocsLinkItem[] | undefined {
  if (rawLinks == null) return undefined;
  if (!Array.isArray(rawLinks)) {
    throw new Error(`Invalid docs config: ${label} must be an array.`);
  }

  return rawLinks.map((link, index) => {
    assertNonEmptyString(link?.title, `${label}[${index}].title`);
    assertNonEmptyString(link?.href, `${label}[${index}].href`);

    return {
      title: link.title,
      href: link.href,
      icon: typeof link.icon === "string" ? link.icon : undefined,
    };
  });
}

function parseSections(rawSections: unknown, label: string): DocsSection[] {
  if (!Array.isArray(rawSections) || rawSections.length === 0) {
    throw new Error(`Invalid docs config: ${label} must be a non-empty array.`);
  }

  return rawSections.map((section, sectionIndex) => {
    assertNonEmptyString(section?.id, `${label}[${sectionIndex}].id`);
    assertNonEmptyString(section?.title, `${label}[${sectionIndex}].title`);

    const rawPages = section?.pages;
    if (!Array.isArray(rawPages) || rawPages.length === 0) {
      throw new Error(`Invalid docs config: ${label}[${sectionIndex}].pages must be a non-empty array.`);
    }

    const pages: DocsPage[] = rawPages.map((page, pageIndex) => {
      assertNonEmptyString(page?.title, `${label}[${sectionIndex}].pages[${pageIndex}].title`);
      assertNonEmptyString(page?.slug, `${label}[${sectionIndex}].pages[${pageIndex}].slug`);
      assertNonEmptyString(page?.file, `${label}[${sectionIndex}].pages[${pageIndex}].file`);

      return {
        title: page.title,
        slug: page.slug.replace(/^\//, "").replace(/\/$/, ""),
        file: page.file,
        description: typeof page.description === "string" ? page.description : undefined,
        icon: typeof page.icon === "string" ? page.icon : undefined,
        trailingChevron: page?.trailingChevron === true,
      };
    });

    return {
      id: section.id,
      title: section.title,
      pages,
    };
  });
}

function validateConfig(raw: unknown): DocsConfig {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid docs config: expected an object.");
  }

  const site = (raw as any).site;
  assertNonEmptyString(site?.title, "site.title");

  const rawVersions = (raw as any).versions;
  if (!Array.isArray(rawVersions) || rawVersions.length === 0) {
    throw new Error("Invalid docs config: versions must be a non-empty array.");
  }

  const versions: DocsVersion[] = rawVersions.map((version, versionIndex) => {
    assertNonEmptyString(version?.id, `versions[${versionIndex}].id`);
    assertNonEmptyString(version?.label, `versions[${versionIndex}].label`);

    return {
      id: version.id,
      label: version.label,
      tag: typeof version.tag === "string" ? version.tag : undefined,
      default: version?.default === true,
      tabs: parseTabs(version?.tabs, `versions[${versionIndex}].tabs`),
      primaryLinks: parsePrimaryLinks(version?.primaryLinks, `versions[${versionIndex}].primaryLinks`),
      sections: parseSections(version?.sections, `versions[${versionIndex}].sections`),
    };
  });

  const defaultVersions = versions.filter((version) => version.default);
  if (defaultVersions.length > 1) {
    throw new Error("Invalid docs config: only one version can be marked default.");
  }

  const seenVersionIds = new Set<string>();
  for (const version of versions) {
    if (seenVersionIds.has(version.id)) {
      throw new Error(`Invalid docs config: duplicate version "${version.id}".`);
    }
    seenVersionIds.add(version.id);

    const seenSlugs = new Set<string>();
    for (const section of version.sections) {
      for (const page of section.pages) {
        if (seenSlugs.has(page.slug)) {
          throw new Error(`Invalid docs config: duplicate slug "${page.slug}" in version "${version.id}".`);
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
    versions,
  };
}

export async function loadDocsConfig(): Promise<DocsConfig> {
  const configPath = path.join(process.cwd(), CONFIG_FILENAME);
  const content = await fs.readFile(configPath, "utf8");
  const parsed = parseYaml(content);
  return validateConfig(parsed);
}

export function getDefaultVersion(config: DocsConfig): DocsVersion {
  return config.versions.find((version) => version.default) ?? config.versions[0]!;
}

export function findVersion(config: DocsConfig, versionId: string): DocsVersion | null {
  return config.versions.find((version) => version.id === versionId) ?? null;
}

export function flattenDocsPages(version: DocsVersion): Array<{ section: DocsSection; page: DocsPage }> {
  const pages: Array<{ section: DocsSection; page: DocsPage }> = [];
  for (const section of version.sections) {
    for (const page of section.pages) {
      pages.push({ section, page });
    }
  }
  return pages;
}

export function getVersionFirstPage(version: DocsVersion): DocsPage | null {
  const section = version.sections[0];
  if (!section) return null;
  return section.pages[0] ?? null;
}

export function buildDocsPath(versionId: string, slug?: string): string {
  return slug ? `/${versionId}/${slug}` : `/${versionId}`;
}

export function findDocsPage(config: DocsConfig, versionId: string, slug: string): { version: DocsVersion; section: DocsSection; page: DocsPage } | null {
  const version = findVersion(config, versionId);
  if (!version) return null;

  for (const section of version.sections) {
    const page = section.pages.find((item) => item.slug === slug);
    if (page) {
      return { version, section, page };
    }
  }

  return null;
}

function parseYaml(input: string): unknown {
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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    return value;
  }

  function currentFrame() {
    return stack[stack.length - 1]!;
  }

  const nextContentLine = (fromIndex: number) => {
    for (let i = fromIndex; i < lines.length; i += 1) {
      const raw = lines[i] ?? "";
      const trimmed = raw.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const indent = raw.match(/^ */)?.[0]?.length ?? 0;
      return { indent, trimmed };
    }
    return null;
  };

  for (let index = 0; index < lines.length; index += 1) {
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
        const idx = rest.indexOf(":");
        const key = rest.slice(0, idx).trim();
        const valueRaw = rest.slice(idx + 1).trim();
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
