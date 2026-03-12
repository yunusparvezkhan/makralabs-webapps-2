import Link from "next/link";
import { buildDocsPath } from "@/lib/docs/config";
import type { DocsConfig, DocsLinkItem, DocsPage, DocsVersion } from "@/lib/docs/types";
import { DocsVersionSwitcher } from "./DocsVersionSwitcher";

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
    case "play":
      return (
        <svg {...common}>
          <path d="M5 3.5 12 8l-7 4.5Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "blog":
      return (
        <svg {...common}>
          <rect x="2.5" y="3" width="11" height="10" rx="1.5" />
          <path d="M5 6.5h6M5 9h6M5 11.5h4" />
        </svg>
      );
    case "community":
      return (
        <svg {...common}>
          <path d="M5.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM10.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
          <path d="M3 12c.6-1.4 1.7-2 3.3-2h3.4c1.6 0 2.7.6 3.3 2" />
        </svg>
      );
    case "changelog":
      return (
        <svg {...common}>
          <path d="M4 3.5h8M4 8h8M4 12.5h8" />
          <circle cx="2.5" cy="3.5" r=".75" fill="currentColor" stroke="none" />
          <circle cx="2.5" cy="8" r=".75" fill="currentColor" stroke="none" />
          <circle cx="2.5" cy="12.5" r=".75" fill="currentColor" stroke="none" />
        </svg>
      );
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
      return <span className="docs-nav-icon docs-nav-icon-dot" aria-hidden="true" />;
  }
}

function DocsPrimaryLink({ link }: { link: DocsLinkItem }) {
  const isExternal = /^https?:\/\//.test(link.href);

  return (
    <Link
      href={link.href}
      className="docs-utility-link"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
    >
      <Icon name={link.icon} />
      <span>{link.title}</span>
    </Link>
  );
}

function DocsPageLink({ version, page, activeSlug }: { version: DocsVersion; page: DocsPage; activeSlug?: string }) {
  const active = page.slug === activeSlug;

  return (
    <Link
      href={buildDocsPath(version.id, page.slug)}
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

export function DocsSidebar({
  config,
  version,
  activeSlug,
}: {
  config: DocsConfig;
  version: DocsVersion;
  activeSlug?: string;
}) {
  const tabs = version.tabs ?? [];

  return (
    <aside className="docs-sidebar">
      <div className="docs-sidebar-panel">
        {tabs.length > 0 ? (
          <div className="docs-tabs" role="tablist" aria-label="Documentation tabs">
            {tabs.map((tab, index) => (
              <Link
                key={`${tab.title}-${tab.href}`}
                href={tab.href}
                className={["docs-tab", index === 0 ? "docs-tab-active" : ""].join(" ")}
              >
                {tab.title}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="docs-version-row">
          <span className="docs-version-tag">{version.tag ?? "Version"}</span>
          <DocsVersionSwitcher config={config} currentVersion={version} activeSlug={activeSlug} />
        </div>

        {version.primaryLinks?.length ? (
          <div className="docs-utility-links">
            {version.primaryLinks.map((link) => (
              <DocsPrimaryLink key={link.title} link={link} />
            ))}
          </div>
        ) : null}

        <div className="docs-section-list">
          {version.sections.map((section) => (
            <section key={section.id} className="docs-section-block">
              <h2 className="docs-section-title">{section.title}</h2>
              <div className="docs-section-pages">
                {section.pages.map((page) => (
                  <DocsPageLink key={page.slug} version={version} page={page} activeSlug={activeSlug} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </aside>
  );
}
