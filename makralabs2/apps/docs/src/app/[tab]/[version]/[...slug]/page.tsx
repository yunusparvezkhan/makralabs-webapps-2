import fs from "node:fs/promises";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsContent } from "@/components/docs/DocsContent.client";
import { DocsTocClient } from "@/components/docs/DocsToc.client";
import { buildDocsPath, findDocsPage, flattenDocsPages, loadDocsConfig, resolveDocsAppPath } from "@/lib/docs/config";
import { renderMarkdown } from "@/lib/docs/markdown";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DocsPage({
  params,
}: {
  params: Promise<{ tab: string; version: string; slug: string[] }>;
}) {
  const { tab, version, slug: segments } = await params;
  const slug = segments.join("/");

  const config = await loadDocsConfig();
  const resolved = findDocsPage(config, tab, version, slug);
  if (!resolved) notFound();

  const markdownPath = resolveDocsAppPath(resolved.page.file);
  let markdown = "";
  try {
    markdown = await fs.readFile(markdownPath, "utf8");
  } catch (error) {
    const fileReadError = error as NodeJS.ErrnoException;
    if (fileReadError.code === "ENOENT") {
      notFound();
    }
    throw error;
  }

  const { html } = await renderMarkdown(markdown);
  const currentTabId = resolved.section.tabId;
  const flat = flattenDocsPages(resolved.version).filter((item) => item.section.tabId === currentTabId);
  const activeIndex = flat.findIndex((item) => item.page.path === resolved.page.path);
  const prev = activeIndex > 0 ? flat[activeIndex - 1] : null;
  const next = activeIndex >= 0 && activeIndex < flat.length - 1 ? flat[activeIndex + 1] : null;

  return (
    <>
      <article className="docs-article">
        <div className="flex flex-col gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-black/50">{resolved.section.title}</div>
            <h1 className="mt-3 font-[var(--font-cormorant)] text-4xl font-semibold text-black">
              {resolved.page.title}
            </h1>
          </div>

          <DocsContent html={html} />

          <div className="docs-pagination">
            {prev ? (
              <Link
                href={buildDocsPath(currentTabId, resolved.version.id, prev.page.path)}
                className="docs-pagination__link docs-pagination__link--prev"
              >
                <span className="docs-pagination__arrow" aria-hidden="true">
                  &larr;
                </span>
                <span className="docs-pagination__title">{prev.page.title}</span>
              </Link>
            ) : (
              <div aria-hidden="true" />
            )}

            {next ? (
              <Link
                href={buildDocsPath(currentTabId, resolved.version.id, next.page.path)}
                className="docs-pagination__link docs-pagination__link--next"
              >
                <span className="docs-pagination__title">{next.page.title}</span>
                <span className="docs-pagination__arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            ) : (
              <div aria-hidden="true" />
            )}
          </div>
        </div>
      </article>

      <DocsTocClient selector="#docs-content" />
    </>
  );
}
