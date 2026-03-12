import { notFound, redirect } from "next/navigation";
import { buildDocsPath, findVersion, getVersionFirstPage, loadDocsConfig } from "@/lib/docs/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DocsVersionHomePage({ params }: { params: Promise<{ version: string }> }) {
  const { version: versionId } = await params;
  const config = await loadDocsConfig();
  const version = findVersion(config, versionId);

  if (!version) notFound();

  const firstPage = getVersionFirstPage(version);
  redirect(buildDocsPath(version.id, firstPage?.slug));
}
