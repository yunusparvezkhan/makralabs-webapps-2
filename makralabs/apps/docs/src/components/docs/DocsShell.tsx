import Link from "next/link";
import { flattenDocsPages } from "@/lib/docs/config";
import type { DocsConfig } from "@/lib/docs/types";
import { DocsHeader } from "./DocsHeader";
import { DocsSidebar } from "./DocsSidebar";
import { DocsTocClient } from "./DocsToc.client";

export function DocsShell({
  config,
  activeSectionId,
  activeSlug,
  pageTitle,
  sectionTitle,
  subsectionTitle,
  html,
}: {
  config: DocsConfig;
  activeSectionId?: string;
  activeSlug?: string;
  pageTitle: string;
  sectionTitle: string;
  subsectionTitle?: string;
  html: string;
}) {
  const flat = flattenDocsPages(config);
  const activeIndex = activeSlug ? flat.findIndex((p) => p.page.slug === activeSlug) : -1;
  const prev = activeIndex > 0 ? flat[activeIndex - 1] : null;
  const next = activeIndex >= 0 && activeIndex < flat.length - 1 ? flat[activeIndex + 1] : null;

  return (
    <>
      <DocsHeader config={config} activeSectionId={activeSectionId} />

      <div className="docs-shell">
        <DocsSidebar config={config} activeSlug={activeSlug} />

        <article className="py-2 md:py-4">
          <div className="flex flex-col gap-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-black/50">
                {subsectionTitle ? `${sectionTitle} / ${subsectionTitle}` : sectionTitle}
              </div>
              <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl font-semibold tracking-tight text-black">
                {pageTitle}
              </h1>
            </div>

            <div id="docs-content" className="docs-prose" dangerouslySetInnerHTML={{ __html: html }} />

            <div className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              {prev ? (
                <Link href={`/${prev.page.slug}`} className="rounded-md border px-4 py-3 text-sm hover:bg-black/5">
                  <div className="text-xs text-black/50">Previous</div>
                  <div className="font-semibold">{prev.page.title}</div>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link
                  href={`/${next.page.slug}`}
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
