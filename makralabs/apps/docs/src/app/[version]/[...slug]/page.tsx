import fs from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { findDocsPage, loadDocsConfig } from "@/lib/docs/config";
import { renderMarkdown } from "@/lib/docs/markdown";
import { DocsShell } from "@/components/docs/DocsShell";

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

  return (
    <DocsShell
      config={config}
      version={resolved.version}
      activeSlug={resolved.page.slug}
      sectionTitle={resolved.section.title}
      pageTitle={resolved.page.title}
      html={html}
    />
  );
}
