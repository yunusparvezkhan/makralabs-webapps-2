import fs from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { findDocsPage, loadDocsConfig } from "@/lib/docs/config";
import { renderMarkdown } from "@/lib/docs/markdown";
import { DocsShell } from "@/components/docs/DocsShell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DocsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: segments } = await params;
  const slug = segments.join("/");

  const config = await loadDocsConfig();
  const resolved = findDocsPage(config, slug);
  if (!resolved) notFound();

  const markdownPath = path.join(process.cwd(), resolved.page.file);
  const markdown = await fs.readFile(markdownPath, "utf8");
  const { html } = await renderMarkdown(markdown);

  return (
    <DocsShell
      config={config}
      activeSectionId={resolved.section.id}
      activeSlug={resolved.page.slug}
      sectionTitle={resolved.section.title}
      pageTitle={resolved.page.title}
      html={html}
    />
  );
}
