import { redirect } from "next/navigation";
import { buildDocsPath, getDefaultVersion, getVersionFirstPage, loadDocsConfig } from "@/lib/docs/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DocsHomePage() {
  const config = await loadDocsConfig();
  const version = getDefaultVersion(config);
  const firstPage = getVersionFirstPage(version);

  redirect(buildDocsPath(version.id, firstPage?.slug));
}
