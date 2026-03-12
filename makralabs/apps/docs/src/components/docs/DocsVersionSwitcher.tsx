"use client";

import { useRouter } from "next/navigation";
import type { DocsConfig, DocsVersion } from "@/lib/docs/types";

function buildDocsPath(versionId: string, slug?: string) {
  return slug ? `/${versionId}/${slug}` : `/${versionId}`;
}

export function DocsVersionSwitcher({
  config,
  currentVersion,
  activeSlug,
}: {
  config: DocsConfig;
  currentVersion: DocsVersion;
  activeSlug?: string;
}) {
  const router = useRouter();

  return (
    <label className="docs-version-select-wrap">
      <span className="sr-only">Select documentation version</span>
      <select
        className="docs-version-select"
        value={currentVersion.id}
        onChange={(event) => {
          const versionId = event.target.value;
          const targetVersion = config.versions.find((version) => version.id === versionId) ?? currentVersion;
          const matchingPage = activeSlug
            ? targetVersion.sections.flatMap((section) => section.pages).find((page) => page.slug === activeSlug)
            : null;
          const fallbackPage = targetVersion.sections[0]?.pages[0];
          router.push(buildDocsPath(versionId, matchingPage?.slug ?? fallbackPage?.slug));
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
