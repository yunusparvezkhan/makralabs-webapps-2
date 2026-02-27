import Link from "next/link";
import type { DocsConfig } from "@/lib/docs/types";
import { CopyPageButton } from "./CopyPageButton";
import { DocsHeader } from "./DocsHeader";
import { DocsSidebar } from "./DocsSidebar";
import { DocsTocClient } from "./DocsToc.client";

function flattenPages(config: DocsConfig) {
  const pages: { slug: string; title: string }[] = [];
  for (const section of config.sections) {
    for (const page of section.pages) pages.push({ slug: page.slug, title: page.title });
  }
  return pages;
}

export function DocsShell({
  config,
  activeSectionId,
  activeSlug,
  pageTitle,
  sectionTitle,
  html,
}: {
  config: DocsConfig;
  activeSectionId?: string;
  activeSlug?: string;
  pageTitle: string;
  sectionTitle: string;
  html: string;
}) {
  const flat = flattenPages(config);
  const activeIndex = activeSlug ? flat.findIndex((p) => p.slug === activeSlug) : -1;
  const prev = activeIndex > 0 ? flat[activeIndex - 1] : null;
  const next = activeIndex >= 0 && activeIndex < flat.length - 1 ? flat[activeIndex + 1] : null;

  const canonicalPath = activeSlug ? `/${activeSlug}` : "/";
  const canonicalHref = new URL(canonicalPath, process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001").toString();

  return (
    <>
      <DocsHeader config={config} activeSectionId={activeSectionId} />

      <div className="docs-shell">
        <DocsSidebar config={config} activeSlug={activeSlug} />

        <article className="docs-card p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-black/50">{sectionTitle}</div>
                <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl font-semibold tracking-tight text-black">
                  {pageTitle}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <CopyPageButton href={canonicalHref} />
              </div>
            </div>

            <div id="docs-content" className="docs-prose" dangerouslySetInnerHTML={{ __html: html }} />

            <div className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              {prev ? (
                <Link href={`/${prev.slug}`} className="rounded-xl border px-4 py-3 text-sm hover:bg-black/5">
                  <div className="text-xs text-black/50">Previous</div>
                  <div className="font-semibold">{prev.title}</div>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link
                  href={`/${next.slug}`}
                  className="rounded-xl border px-4 py-3 text-sm hover:bg-black/5 sm:text-right"
                >
                  <div className="text-xs text-black/50">Next</div>
                  <div className="font-semibold">{next.title}</div>
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
