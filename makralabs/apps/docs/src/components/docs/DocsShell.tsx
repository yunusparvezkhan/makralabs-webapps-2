import Link from "next/link";
import { buildDocsPath, flattenDocsPages } from "@/lib/docs/config";
import type { DocsConfig, DocsVersion } from "@/lib/docs/types";
import { DocsHeader } from "./DocsHeader";
import { DocsSidebar } from "./DocsSidebar";
import { DocsTocClient } from "./DocsToc.client";

export function DocsShell({
  config,
  version,
  activeSlug,
  pageTitle,
  sectionTitle,
  html,
}: {
  config: DocsConfig;
  version: DocsVersion;
  activeSlug?: string;
  pageTitle: string;
  sectionTitle: string;
  html: string;
}) {
  const flat = flattenDocsPages(version);
  const activeIndex = activeSlug ? flat.findIndex((p) => p.page.slug === activeSlug) : -1;
  const prev = activeIndex > 0 ? flat[activeIndex - 1] : null;
  const next = activeIndex >= 0 && activeIndex < flat.length - 1 ? flat[activeIndex + 1] : null;

  return (
    <>
      <DocsHeader config={config} />

      <div className="docs-shell">
        <DocsSidebar config={config} version={version} activeSlug={activeSlug} />

        <article className="py-2 md:py-4">
          <div className="flex flex-col gap-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-black/50">{sectionTitle}</div>
              <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl font-semibold tracking-tight text-black">
                {pageTitle}
              </h1>
            </div>

            <div id="docs-content" className="docs-prose" dangerouslySetInnerHTML={{ __html: html }} />

            <div className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              {prev ? (
                <Link
                  href={buildDocsPath(version.id, prev.page.slug)}
                  className="rounded-md border px-4 py-3 text-sm hover:bg-black/5"
                >
                  <div className="text-xs text-black/50">Previous</div>
                  <div className="font-semibold">{prev.page.title}</div>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link
                  href={buildDocsPath(version.id, next.page.slug)}
                  className="rounded-md border px-4 py-3 text-sm hover:bg-black/5 sm:text-right"
                >
                  <div className="text-xs text-black/50">Next</div>
                  <div className="font-semibold">{next.page.title}</div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </article>

        <DocsTocClient selector="#docs-content" />
      </div>
    </>
  );
}
