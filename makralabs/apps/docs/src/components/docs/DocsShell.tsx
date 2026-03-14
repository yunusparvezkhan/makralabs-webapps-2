"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { findVersion, getDefaultVersion } from "@/lib/docs/utils";
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
  const currentVersion = useMemo(() => {
    const versionId = pathname.split("/").filter(Boolean)[0];
    if (!versionId) {
      return getDefaultVersion(config);
    }

    return findVersion(config, versionId) ?? getDefaultVersion(config);
  }, [config, pathname]);

  return (
    <>
      <DocsHeader />

      <div className="docs-shell">
        <DocsSidebar config={config} version={currentVersion} />
        {children}
      </div>
    </>
  );
}
