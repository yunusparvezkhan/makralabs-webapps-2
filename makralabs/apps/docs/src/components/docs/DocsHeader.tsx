import type { DocsConfig } from "@/lib/docs/types";
import { Navbar } from "@/components/navbar";

export function DocsHeader({ config: _config }: { config: DocsConfig }) {
  return (
    <header className="sticky top-0 z-40 bg-white">
      <Navbar
        links={[
          { href: "/", label: "Docs home" },
          { href: "https://makralabs.org", label: "Homepage" },
        ]}
      />
      <div className="makra-navbar-spacer" />
    </header>
  );
}
