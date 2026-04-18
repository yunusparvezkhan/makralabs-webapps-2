"use client";

import Link from "next/link";
import { DEFAULT_NAVBAR_LINKS, Navbar as SharedNavbar, type NavbarProps } from "@makralabs/ui";
import { useDashboardAuth } from "@/providers/dashboard-auth-provider";

export function Navbar(props: NavbarProps) {
  const { isAuthenticated } = useDashboardAuth();
  const { links = DEFAULT_NAVBAR_LINKS, ...navbarProps } = props;

  return (
    <SharedNavbar
      {...navbarProps}
      LinkComponent={Link}
      links={links}
      isSignedIn={isAuthenticated}
    />
  );
}
