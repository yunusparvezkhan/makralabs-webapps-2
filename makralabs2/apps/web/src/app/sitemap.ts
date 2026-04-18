import { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { buildDocsPath, flattenDocsPages, loadDocsConfig } from "@/lib/docs/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL;
  const now = new Date();
  const docsConfig = await loadDocsConfig();
  const docsRoutes = docsConfig.versions.flatMap((version) =>
    flattenDocsPages(version).map(({ section, page }) => ({
      url: `${baseUrl}${buildDocsPath(section.tabId, version.id, page.path)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: version.default ? 0.8 : 0.6,
    }))
  );

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...docsRoutes,
  ];
}
