"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { usePathname } from "next/navigation";
import { DashboardAuthProvider } from "@/providers/dashboard-auth-provider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideMarketingChrome =
    pathname === "/dashboard" ||
    pathname?.startsWith("/dashboard/") ||
    pathname === "/docs" ||
    pathname?.startsWith("/docs/") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/auth/callback";

  return (
    <DashboardAuthProvider>
      <div className="min-h-screen min-w-screen bg-white">
        {!hideMarketingChrome ? <Navbar /> : null}
        {children}
        {!hideMarketingChrome ? <Footer /> : null}
      </div>
    </DashboardAuthProvider>
  );
}
