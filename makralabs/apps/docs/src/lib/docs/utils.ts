import type { DocsConfig, DocsPage, DocsSection, DocsVersion } from "./types";

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

export function getDocsSlugFromPathname(pathname: string, versionId: string): string | undefined {
  const normalizedPath = pathname.split("?")[0]?.split("#")[0] ?? pathname;
  const segments = normalizedPath.split("/").filter(Boolean);
  if (segments[0] !== versionId) return undefined;

  const slug = segments.slice(1).join("/");
  return slug || undefined;
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
