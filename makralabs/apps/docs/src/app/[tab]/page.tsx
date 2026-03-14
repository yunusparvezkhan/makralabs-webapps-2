import { notFound, redirect } from "next/navigation";
import { buildDocsPath, getDefaultVersion, getTabFirstPage, loadDocsConfig } from "@/lib/docs/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DocsTabHomePage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  const config = await loadDocsConfig();
  const version = getDefaultVersion(config);
  const matchingTab = version.tabs?.find((item) => item.id === tab);

  if (!matchingTab) notFound();

  const firstPage = getTabFirstPage(version, tab);
  redirect(buildDocsPath(tab, version.id, firstPage?.path));
}
