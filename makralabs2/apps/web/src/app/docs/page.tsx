import { redirect } from "next/navigation";
import {
  buildDocsPath,
  getDefaultVersion,
  getTabFirstPage,
  loadDocsConfig,
} from "@/lib/docs/config";

export const runtime = "nodejs";
export const dynamic = "force-static";

export default async function DocsHomePage() {
  const config = await loadDocsConfig();
  const version = getDefaultVersion(config);
  const defaultTab = version.tabs?.[0];

  if (!defaultTab) {
    redirect("/");
  }

  const firstPage = getTabFirstPage(version, defaultTab.id);
  redirect(buildDocsPath(defaultTab.id, version.id, firstPage?.path));
}
