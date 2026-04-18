"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { IoDocumentText } from "react-icons/io5";
import type { DocsPage, DocsSection, DocsVersion } from "@/lib/docs/types";
import { buildDocsPath, getDocsPathFromPathname } from "@/lib/docs/utils";

const SIDEBAR_SCROLL_KEY_PREFIX = "docs-sidebar-scroll";

function Icon({ name }: { name?: string }) {
  const common = {
    viewBox: "0 0 16 16",
    width: 16,
    height: 16,
    "aria-hidden": true,
    className: "docs-nav-icon",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "browser":
      return (
        <svg {...common}>
          <rect x="2.5" y="3" width="11" height="10" rx="1.5" />
          <path d="M2.5 6h11" />
        </svg>
      );
    case "agent":
      return (
        <svg {...common}>
          <path d="M8 2.5v2M4.5 6.5 3 8l1.5 1.5M11.5 6.5 13 8l-1.5 1.5M6 13h4" />
          <rect x="5" y="4.5" width="6" height="7" rx="2" />
        </svg>
      );
    case "scrape":
      return (
        <svg {...common}>
          <path d="M3.5 4.5h9v7h-9zM6 7.5h4" />
          <path d="M2.5 11.5h2M11.5 11.5h2" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="3.5" />
          <path d="m10 10 3 3" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M2.5 4.5 6 3l4 1 3.5-1.5v9L10 13l-4-1-3.5 1.5z" />
          <path d="M6 3v9M10 4v9" />
        </svg>
      );
    case "crawl":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="1.4" />
          <path d="M8 2.5v2M8 11.5v2M2.5 8h2M11.5 8h2M4.1 4.1l1.4 1.4M10.5 10.5l1.4 1.4M11.9 4.1l-1.4 1.4M5.5 10.5l-1.4 1.4" />
        </svg>
      );
    case "opencrawl":
      return (
        <svg {...common}>
          <path d="M8 2.5v11M3.5 5 8 8l4.5-3" />
          <path d="M4 11c1-1 2.2-1.5 4-1.5S11 10 12 11" />
        </svg>
      );
    case "templates":
      return (
        <svg {...common}>
          <path d="M8 2.5 9.7 5.9l3.8.6-2.7 2.6.6 3.7L8 11l-3.4 1.8.6-3.7L2.5 6.5l3.8-.6z" />
        </svg>
      );
    case "guides":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.5" />
          <path d="M8 5.5v2.7l2 1.3" />
        </svg>
      );
    case "sdk":
      return (
        <svg {...common}>
          <path d="M3.5 4.5h3v3h-3zM9.5 4.5h3v3h-3zM6.5 8.5h3v3h-3z" />
        </svg>
      );
    case "cookbooks":
      return (
        <svg {...common}>
          <path d="M4 3.5h6.5a1.5 1.5 0 0 1 1.5 1.5v7.5H5.5A1.5 1.5 0 0 0 4 14" />
          <path d="M4 3.5v10.5M6 6.5h4M6 9h4" />
        </svg>
      );
    default:
      return <IoDocumentText className="docs-nav-icon" aria-hidden="true" />;
  }
}

function DocsPageLink({
  version,
  currentTabId,
  page,
  activeSlug,
}: {
  version: DocsVersion;
  currentTabId: string;
  page: DocsPage;
  activeSlug?: string;
}) {
  const active = page.path === activeSlug;

  return (
    <Link
      href={buildDocsPath(currentTabId, version.id, page.path)}
      className={["docs-page-link", active ? "docs-page-link-active" : ""].filter(Boolean).join(" ")}
    >
      <span className="docs-page-link-main">
        <Icon name={page.icon} />
        <span>{page.title}</span>
      </span>
      {page.trailingChevron ? <span className="docs-page-link-chevron" aria-hidden="true">›</span> : null}
    </Link>
  );
}

function useDocsIndexState({
  version,
  currentTabId,
  activeSlug,
}: {
  version: DocsVersion;
  currentTabId?: string;
  activeSlug?: string;
}) {
  const pathname = usePathname();
  const resolvedCurrentTabId = useMemo(() => currentTabId ?? version.tabs?.[0]?.id ?? "", [currentTabId, version.tabs]);
  const resolvedActiveSlug = useMemo(
    () => activeSlug ?? getDocsPathFromPathname(pathname, resolvedCurrentTabId, version.id),
    [activeSlug, pathname, resolvedCurrentTabId, version.id],
  );
  const visibleSections = useMemo(
    () => version.sections.filter((section) => !resolvedCurrentTabId || section.tabId === resolvedCurrentTabId),
    [resolvedCurrentTabId, version.sections],
  );

  return {
    pathname,
    resolvedCurrentTabId,
    resolvedActiveSlug,
    visibleSections,
  };
}

function DocsIndexSections({
  version,
  currentTabId,
  activeSlug,
  visibleSections,
}: {
  version: DocsVersion;
  currentTabId: string;
  activeSlug?: string;
  visibleSections: DocsSection[];
}) {
  return (
    <div className="docs-section-list">
      {visibleSections.map((section) => (
        <section key={section.id} className="docs-section-block">
          <h2 className="docs-section-title">{section.title}</h2>
          <div className="docs-section-pages">
            {section.pages.map((page) => (
              <DocsPageLink
                key={page.path}
                version={version}
                currentTabId={currentTabId}
                page={page}
                activeSlug={activeSlug}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function DocsMobileIndex({
  version,
  currentTabId,
  activeSlug,
}: {
  version: DocsVersion;
  currentTabId?: string;
  activeSlug?: string;
}) {
  const { resolvedCurrentTabId, resolvedActiveSlug, visibleSections } = useDocsIndexState({
    version,
    currentTabId,
    activeSlug,
  });

  return (
    <div className="docs-mobile-index">
      <div className="docs-mobile-index__label">Page index</div>
      <DocsIndexSections
        version={version}
        currentTabId={resolvedCurrentTabId}
        activeSlug={resolvedActiveSlug}
        visibleSections={visibleSections}
      />
    </div>
  );
}

export function DocsSidebar({
  version,
  currentTabId,
  activeSlug,
}: {
  version: DocsVersion;
  currentTabId?: string;
  activeSlug?: string;
}) {
  const sidebarRef = useRef<HTMLElement>(null);
  const { pathname, resolvedCurrentTabId, resolvedActiveSlug, visibleSections } = useDocsIndexState({
    version,
    currentTabId,
    activeSlug,
  });
  const storageKey = useMemo(
    () => `${SIDEBAR_SCROLL_KEY_PREFIX}:${version.id}:${resolvedCurrentTabId}`,
    [resolvedCurrentTabId, version.id],
  );

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const persistScrollPosition = () => {
      try {
        window.sessionStorage.setItem(storageKey, String(sidebar.scrollTop));
      } catch {
        // Ignore storage failures and keep the sidebar usable.
      }
    };

    persistScrollPosition();
    sidebar.addEventListener("scroll", persistScrollPosition, { passive: true });

    return () => {
      persistScrollPosition();
      sidebar.removeEventListener("scroll", persistScrollPosition);
    };
  }, [storageKey]);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    try {
      const savedScrollTop = window.sessionStorage.getItem(storageKey);
      if (savedScrollTop === null) return;

      const nextScrollTop = Number(savedScrollTop);
      if (!Number.isFinite(nextScrollTop)) return;

      sidebar.scrollTop = nextScrollTop;
    } catch {
      // Ignore storage failures and fall back to the default browser behavior.
    }
  }, [pathname, storageKey]);

  return (
    <aside ref={sidebarRef} className="docs-sidebar">
      <div className="docs-sidebar-panel">
        <DocsIndexSections
          version={version}
          currentTabId={resolvedCurrentTabId}
          activeSlug={resolvedActiveSlug}
          visibleSections={visibleSections}
        />
      </div>
    </aside>
  );
}
