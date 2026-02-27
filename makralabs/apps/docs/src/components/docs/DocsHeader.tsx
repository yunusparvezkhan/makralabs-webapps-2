import Link from "next/link";
import type { DocsConfig } from "@/lib/docs/types";

export function DocsHeader({ config, activeSectionId }: { config: DocsConfig; activeSectionId?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-5 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-[var(--font-cormorant)] text-xl font-semibold tracking-tight">Makra</span>
          <span className="text-sm text-black/60">Docs</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-3 sm:flex">
          <Link className="text-sm text-black/70 hover:text-black" href="/">
            Docs home
          </Link>
          <a className="text-sm text-black/70 hover:text-black" href="https://makralabs.org" target="_blank" rel="noreferrer">
            Homepage
          </a>
          <a
            className="makra-web-btn-green rounded-xl px-4 py-2 text-sm font-semibold"
            href="https://makralabs.org"
            target="_blank"
            rel="noreferrer"
          >
            Get Makra
          </a>
        </nav>
      </div>

      <div className="mx-auto max-w-[1240px] px-5 pb-3">
        <nav className="flex flex-wrap gap-4 border-b pb-3">
          {config.sections.map((section) => {
            const href = `/${section.pages[0]?.slug ?? ""}`;
            const active = section.id === activeSectionId;
            return (
              <Link
                key={section.id}
                href={href}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  active ? "bg-black text-white shadow-sm" : "text-black/80 hover:text-black",
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
