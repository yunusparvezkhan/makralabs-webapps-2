"use client";

import Link from "next/link";
import { DEFAULT_NAVBAR_LINKS, Navbar as SharedNavbar, type NavbarProps } from "@makralabs/ui";

export function Navbar(props: NavbarProps) {
  return <SharedNavbar {...props} LinkComponent={Link} links={DEFAULT_NAVBAR_LINKS} />;
}
