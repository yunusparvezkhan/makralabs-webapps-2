"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type TocItem = {
  depth: 2 | 3;
  title: string;
  id: string;
};

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function DocsTocClient({
  selector = "#docs-content",
}: {
  selector?: string;
}) {
  const pathname = usePathname();
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    const compute = () => {
      const root = document.querySelector(selector);
      if (!root) return [];

      const headings = Array.from(root.querySelectorAll("h2, h3")) as HTMLHeadingElement[];
      const items: TocItem[] = [];
      for (const el of headings) {
        const depth = el.tagName === "H2" ? 2 : 3;
        const id = el.id;
        const title = normalizeText(el.textContent ?? "");
        if (!id || !title) continue;
        items.push({ depth, id, title });
      }
      return items;
    };

    queueMicrotask(() => {
      if (cancelled) return;
      setToc(compute());
    });

    return () => {
      cancelled = true;
    };
  }, [pathname, selector]);

  const content = useMemo(() => toc, [toc]);

  return (
    <aside className="docs-toc">
      <div className="docs-toc__inner">
        {content.length > 0 ? (
          <div className="docs-toc__section">
            <div className="docs-toc__title">On this page</div>
            <div className="docs-toc__list">
              {content.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={["docs-toc__link", item.depth === 3 ? "docs-toc__link--nested" : ""].filter(Boolean).join(" ")}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
