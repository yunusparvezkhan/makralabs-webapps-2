import type { DocsConfig, DocsPage, DocsSection, DocsVersion } from "./types";

const DOCS_ROUTE_PREFIX = "/docs";

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

export function getTabFirstPage(version: DocsVersion, tabId: string): DocsPage | null {
  const section = version.sections.find((item) => item.tabId === tabId);
  if (!section) return null;
  return section.pages[0] ?? null;
}

export function buildDocsPath(tabId: string, versionId: string, path?: string): string {
  return path ? `${DOCS_ROUTE_PREFIX}/${tabId}/${versionId}/${path}` : `${DOCS_ROUTE_PREFIX}/${tabId}/${versionId}`;
}

export function getDocsRouteFromPathname(pathname: string): {
  tabId?: string;
  versionId?: string;
  docPath?: string;
} {
  const normalizedPath = pathname.split("?")[0]?.split("#")[0] ?? pathname;
  const segments = normalizedPath.split("/").filter(Boolean);
  if (segments[0] === DOCS_ROUTE_PREFIX.slice(1)) {
    segments.shift();
  }
  const [tabId, versionId, ...docSegments] = segments;
  return {
    tabId,
    versionId,
    docPath: docSegments.length > 0 ? docSegments.join("/") : undefined,
  };
}

export function getDocsPathFromPathname(pathname: string, tabId: string, versionId: string): string | undefined {
  const route = getDocsRouteFromPathname(pathname);
  if (route.tabId !== tabId || route.versionId !== versionId) return undefined;
  return route.docPath;
}

export function findDocsPage(
  config: DocsConfig,
  tabId: string,
  versionId: string,
  path: string,
): { version: DocsVersion; section: DocsSection; page: DocsPage } | null {
  const version = findVersion(config, versionId);
  if (!version) return null;

  for (const section of version.sections) {
    if (section.tabId !== tabId) continue;
    const page = section.pages.find((item) => item.path === path);
    if (page) {
      return { version, section, page };
    }
  }

  return null;
}

export function getDocsTabIdFromPathname(pathname: string): string | undefined {
  return getDocsRouteFromPathname(pathname).tabId;
}
