import { notFound, redirect } from "next/navigation";
import {
  buildDocsPath,
  findVersion,
  getTabFirstPage,
  loadDocsConfig,
} from "@/lib/docs/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DocsVersionHomePage({
  params,
}: {
  params: Promise<{ tab: string; version: string }>;
}) {
  const { tab, version: versionId } = await params;
  const config = await loadDocsConfig();
  const version = findVersion(config, versionId);

  if (!version) notFound();

  const matchingTab = version.tabs?.find((item) => item.id === tab);
  if (!matchingTab) notFound();

  const firstPage = getTabFirstPage(version, tab);
  redirect(buildDocsPath(tab, version.id, firstPage?.path));
}
