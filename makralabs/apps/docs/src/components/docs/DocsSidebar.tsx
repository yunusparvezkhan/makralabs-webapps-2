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
      <div className="p-1">
        {config.sections.map((section) => (
          <div key={section.id} className="mb-5 last:mb-0">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/50">{section.title}</div>
            {section.sections.map((subsection) => (
              <div key={subsection.id} className="mb-3 last:mb-0">
                <div className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-black/45">{subsection.title}</div>
                <div className="flex flex-col gap-1">
                  {subsection.pages.map((page) => {
                    const active = page.slug === activeSlug;
                    return (
                      <Link
                        key={page.slug}
                        href={`/${page.slug}`}
                        className={[
                          "rounded-md px-3 py-2 text-sm transition",
                          active
                            ? "font-bold text-[color:var(--makra-primary-green)]"
                            : "text-black/70 hover:bg-black/5 hover:text-black",
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
        ))}
      </div>
    </aside>
  );
}
