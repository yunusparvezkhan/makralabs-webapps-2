"use client";

import Link from "next/link";
import { Footer as SharedFooter } from "@makralabs/ui";

export function Footer() {
  return <SharedFooter LinkComponent={Link} />;
}
