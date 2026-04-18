import { Navbar } from "@/components/navbar";
import type { ReactNode } from "react";

export function DocsHeader({ mobileMenuContent }: { mobileMenuContent?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 bg-white">
      <Navbar mobileMenuContent={mobileMenuContent} />
      <div className="makra-navbar-spacer" />
    </header>
  );
}
