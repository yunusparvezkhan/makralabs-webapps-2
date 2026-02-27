import Link from "next/link";
import type { DocsConfig } from "@/lib/docs/types";

export function DocsSidebar({
  config,
  activeSlug,
}: {
  config: DocsConfig;
  activeSlug?: string;
}) {
  return (
    <aside className="docs-sidebar">
      <div className="docs-card p-4">
        {config.sections.map((section) => (
          <div key={section.id} className="mb-5 last:mb-0">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/50">{section.title}</div>
            <div className="flex flex-col gap-1">
              {section.pages.map((page) => {
                const active = page.slug === activeSlug;
                return (
                  <Link
                    key={page.slug}
                    href={`/${page.slug}`}
                    className={[
                      "rounded-lg px-3 py-2 text-sm transition",
                      active ? "bg-black/5 font-semibold text-black" : "text-black/70 hover:bg-black/5 hover:text-black",
                    ].join(" ")}
                  >
                    <div className="leading-snug">{page.title}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
