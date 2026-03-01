import Link from "next/link";
import { getSectionFirstPage } from "@/lib/docs/config";
import type { DocsConfig } from "@/lib/docs/types";
import { Navbar } from "@/components/navbar";

export function DocsHeader({ config, activeSectionId }: { config: DocsConfig; activeSectionId?: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white">
      <Navbar
        links={[
          { href: "/", label: "Docs home" },
          { href: "https://makralabs.org", label: "Homepage" },
        ]}
      />
      <div className="mx-auto max-w-[1240px] px-5 py-3">
        <nav className="flex flex-wrap gap-8">
          {config.sections.map((section) => {
            const firstPage = getSectionFirstPage(section);
            const href = firstPage ? `/${firstPage.slug}` : "/";
            const active = section.id === activeSectionId;
            return (
              <Link
                key={section.id}
                href={href}
                className={[
                  "rounded-md text-sm font-semibold transition-colors",
                  active ? "font-bold text-[color:var(--makra-primary-green)]" : "text-black/80 hover:text-black",
                ].join(" ")}
              >
                {section.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
