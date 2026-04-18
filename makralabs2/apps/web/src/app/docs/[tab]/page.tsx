import { notFound, redirect } from "next/navigation";
import {
  buildDocsPath,
  getDocsTabParams,
  getDefaultVersion,
  getTabFirstPage,
  loadDocsConfig,
} from "@/lib/docs/config";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return getDocsTabParams();
}

export default async function DocsTabHomePage({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  const { tab } = await params;
  const config = await loadDocsConfig();
  const version = getDefaultVersion(config);
  const matchingTab = version.tabs?.find((item) => item.id === tab);

  if (!matchingTab) notFound();

  const firstPage = getTabFirstPage(version, tab);
  redirect(buildDocsPath(tab, version.id, firstPage?.path));
}
