"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DashboardRequireAuth } from "@/components/dashboard-require-auth";
import { useDashboardAuth } from "@/providers/dashboard-auth-provider";

function isActivePath(currentPath: string | null, href: string) {
  if (!currentPath) {
    return false;
  }

  if (href === "/dashboard") {
    return currentPath === "/dashboard";
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useDashboardAuth();

  const navItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/credits", label: "Credits" },
    { href: "/dashboard/usage", label: "Usage" },
    { href: "/dashboard/logs", label: "Logs" }
  ];

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <DashboardRequireAuth>
      <div className="dash-app">
        <aside className="dash-sidebar">
          <div className="dash-sidebar-brand">
            <p className="dash-eyebrow">Makra</p>
            <h2 className="dash-sidebar-title">Dashboard</h2>
            <p className="dash-muted">Signed in as {user?.email}</p>
          </div>

          <nav className="dash-nav">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`dash-nav-link ${active ? "dash-nav-link-active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="dash-sidebar-footer">
            <Link className="dash-nav-link" href="/">
              Back to site
            </Link>
            <button type="button" className="dash-btn dash-btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        <div className="dash-main">
          <header className="dash-topbar">
            <div>
              <p className="dash-topbar-kicker">Route</p>
              <p className="dash-topbar-path">{pathname}</p>
            </div>
          </header>
          <div className="dash-main-content">{children}</div>
        </div>
      </div>
    </DashboardRequireAuth>
  );
}
