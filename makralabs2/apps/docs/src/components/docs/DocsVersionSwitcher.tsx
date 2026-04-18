"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { DocsConfig, DocsVersion } from "@/lib/docs/types";
import { buildDocsPath, getDocsPathFromPathname, getDocsRouteFromPathname, getTabFirstPage } from "@/lib/docs/utils";

export function DocsVersionSwitcher({
  config,
  currentVersion,
  activeSlug,
}: {
  config: DocsConfig;
  currentVersion: DocsVersion;
  activeSlug?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const route = useMemo(() => getDocsRouteFromPathname(pathname), [pathname]);
  const currentTabId = route.tabId ?? currentVersion.tabs?.[0]?.id ?? "";
  const resolvedActiveSlug = useMemo(
    () => activeSlug ?? getDocsPathFromPathname(pathname, currentTabId, currentVersion.id),
    [activeSlug, currentTabId, currentVersion.id, pathname],
  );

  return (
    <label className="docs-version-select-wrap">
      <span className="sr-only">Select documentation version</span>
      <select
        className="docs-version-select"
        aria-label="Select documentation version"
        value={currentVersion.id}
        onChange={(event) => {
          const versionId = event.target.value;
          const targetVersion = config.versions.find((version) => version.id === versionId) ?? currentVersion;
          const matchingPage = resolvedActiveSlug
            ? targetVersion.sections
                .filter((section) => section.tabId === currentTabId)
                .flatMap((section) => section.pages)
                .find((page) => page.path === resolvedActiveSlug)
            : null;
          const fallbackPage = getTabFirstPage(targetVersion, currentTabId) ?? targetVersion.sections[0]?.pages[0];
          router.push(buildDocsPath(currentTabId, versionId, matchingPage?.path ?? fallbackPage?.path));
        }}
      >
        {config.versions.map((version) => (
          <option key={version.id} value={version.id}>
            {version.label}
          </option>
        ))}
      </select>
    </label>
  );
}
