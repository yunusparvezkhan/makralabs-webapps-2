"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDashboardAuth } from "@/providers/dashboard-auth-provider";

export function DashboardRequireAuth({ children }: { children: React.ReactNode }) {
  const { isReady, isAuthenticated } = useDashboardAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady || isAuthenticated) {
      return;
    }

    const nextPath = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
    router.replace(`/login${nextPath}`);
  }, [isReady, isAuthenticated, pathname, router]);

  if (!isReady || !isAuthenticated) {
    return (
      <div className="dash-page-center">
        <div className="dash-panel dash-auth-panel">
          <h1>Checking your session</h1>
          <p className="dash-muted">Redirecting to login if needed.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
