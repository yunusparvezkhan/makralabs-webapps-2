"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { findVersion, getDefaultVersion, getDocsRouteFromPathname } from "@/lib/docs/utils";
import type { DocsConfig } from "@/lib/docs/types";
import { DocsHeader } from "./DocsHeader";
import { DocsSidebar } from "./DocsSidebar";

export function DocsShell({
  config,
  children,
}: {
  config: DocsConfig;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const route = useMemo(() => getDocsRouteFromPathname(pathname), [pathname]);
  const currentVersion = useMemo(() => {
    const versionId = route.versionId;
    if (!versionId) {
      return getDefaultVersion(config);
    }

    return findVersion(config, versionId) ?? getDefaultVersion(config);
  }, [config, route.versionId]);
  const activeTabId = useMemo(() => {
    return route.tabId ?? currentVersion.tabs?.[0]?.id;
  }, [currentVersion.tabs, route.tabId]);

  return (
    <>
      <DocsHeader />

      <div className="docs-shell">
        {currentVersion.tabs?.length ? (
          <div className="docs-shell-tabs" role="tablist" aria-label="Documentation tabs">
            <div className="docs-tabs">
              {currentVersion.tabs.map((tab) => (
                <Link
                  key={`${tab.title}-${tab.href}`}
                  href={tab.href}
                  className={["docs-tab", tab.id === activeTabId ? "docs-tab-active" : ""].join(" ")}
                >
                  {tab.title}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <DocsSidebar version={currentVersion} currentTabId={activeTabId} />
        {children}
      </div>
    </>
  );
}
