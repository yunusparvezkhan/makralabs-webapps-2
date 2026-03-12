"use client";

import Link from "next/link";
import {
  Navbar as SharedNavbar,
  DOCS_NAVBAR_LINKS,
  type NavbarProps,
} from "@makralabs/ui";

export function Navbar(props: NavbarProps) {
  return <SharedNavbar LinkComponent={Link} links={DOCS_NAVBAR_LINKS} {...props} />;
}
