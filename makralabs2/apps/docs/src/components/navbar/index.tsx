"use client";

import Link from "next/link";
import {
  Navbar as SharedNavbar,
  DOCS_NAVBAR_LINKS,
  type NavbarProps,
} from "@makralabs/ui";

export function Navbar(props: NavbarProps) {
  const { links = DOCS_NAVBAR_LINKS, ...navbarProps } = props;

  return <SharedNavbar {...navbarProps} LinkComponent={Link} links={links} />;
}
