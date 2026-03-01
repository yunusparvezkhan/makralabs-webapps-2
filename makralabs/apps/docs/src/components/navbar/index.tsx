"use client";

import Link from "next/link";
import { Navbar as SharedNavbar, type NavbarProps } from "@makralabs/ui";

export function Navbar(props: NavbarProps) {
  return <SharedNavbar LinkComponent={Link} {...props} />;
}
