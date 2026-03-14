import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsContent } from "@/components/docs/DocsContent.client";
import { DocsTocClient } from "@/components/docs/DocsToc.client";
import { buildDocsPath, findDocsPage, flattenDocsPages, loadDocsConfig } from "@/lib/docs/config";
import { renderMarkdown } from "@/lib/docs/markdown";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DocsPage({ params }: { params: Promise<{ version: string; slug: string[] }> }) {
  const { version, slug: segments } = await params;
  const slug = segments.join("/");

  const config = await loadDocsConfig();
  const resolved = findDocsPage(config, version, slug);
  if (!resolved) notFound();

  const markdownPath = path.join(process.cwd(), resolved.page.file);
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
  const flat = flattenDocsPages(resolved.version);
  const activeIndex = flat.findIndex((item) => item.page.slug === resolved.page.slug);
  const prev = activeIndex > 0 ? flat[activeIndex - 1] : null;
  const next = activeIndex >= 0 && activeIndex < flat.length - 1 ? flat[activeIndex + 1] : null;

  return (
    <>
      <article className="py-2 md:py-4">
        <div className="flex flex-col gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-black/50">{resolved.section.title}</div>
            <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl font-semibold tracking-tight text-black">
              {resolved.page.title}
            </h1>
          </div>

          <DocsContent html={html} />

          <div className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            {prev ? (
              <Link
                href={buildDocsPath(resolved.version.id, prev.page.slug)}
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
                href={buildDocsPath(resolved.version.id, next.page.slug)}
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
    </>
  );
}
