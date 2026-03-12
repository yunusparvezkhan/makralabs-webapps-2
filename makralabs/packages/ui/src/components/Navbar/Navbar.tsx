"use client";

import type { ComponentType, ReactNode } from "react";

export interface NavbarLink {
  href: string;
  label: string;
}

export interface NavbarProps {
  logoUrl?: string;
  homeHref?: string;
  twitterUrl?: string;
  githubUrl?: string;
  links?: NavbarLink[];
  LinkComponent?: ComponentType<{
    href: string;
    className?: string;
    children: ReactNode;
  }>;
}

export const DEFAULT_NAVBAR_LINKS: NavbarLink[] = [
  { href: "http://localhost:3001/docs", label: "Documentation" },
  { href: "/playground", label: "Playground" },
  { href: "/pricing", label: "Pricing" },
];

export const DOCS_NAVBAR_LINKS: NavbarLink[] = [
  { href: "http://localhost:3000", label: "Home" },
  { href: "/playground", label: "Playground" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar({
  logoUrl = "/logo/192x192.png",
  homeHref = "/",
  twitterUrl = "https://twitter.com/makralabs",
  githubUrl = "https://github.com/makralabs",
  links = DEFAULT_NAVBAR_LINKS,
  LinkComponent,
}: NavbarProps) {
  const InternalLink = LinkComponent;

  const renderInternalLink = ({
    href,
    className,
    children,
  }: {
    href: string;
    className: string;
    children: ReactNode;
  }) =>
    InternalLink ? (
      <InternalLink href={href} className={className}>
        {children}
      </InternalLink>
    ) : (
      <a href={href} className={className}>
        {children}
      </a>
    );

  return (
    <nav className="makra-navbar">
      <div className="makra-navbar__inner">
        <div>
          {renderInternalLink({
            href: homeHref,
            className: "makra-navbar__brand",
            children: (
              <>
                <img
                  src={logoUrl}
                  alt="Makra Labs Logo"
                  width={28}
                  height={28}
                  className="makra-navbar__logo"
                />
                <div className="makra-navbar__title">
                  Makra
                  <span className="makra-navbar__title-accent">labs</span>
                </div>
              </>
            ),
          })}
        </div>

        <div className="makra-navbar__links">
          {links.length > 0 && (
            <div className="makra-navbar__links">
              {links.map((link) =>
                link.href.startsWith("http") ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="makra-navbar__link"
                  >
                    {link.label}
                  </a>
                ) : (
                  <span key={link.href}>
                    {renderInternalLink({
                      href: link.href,
                      className: "makra-navbar__link",
                      children: link.label,
                    })}
                  </span>
                ),
              )}
            </div>
          )}
        </div>

        <div className="makra-navbar__social">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="makra-navbar__social-link"
            aria-label="Makra Labs on X"
          >
            <svg
              className="makra-navbar__icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.9 2h3.7l-8.1 9.2L24 22h-7.4l-5.8-6.7L4.9 22H1.2l8.7-9.9L0 2h7.6l5.2 6.1L18.9 2Zm-1.3 17.8h2l-13-15.8h-2l13 15.8Z" />
            </svg>
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="makra-navbar__social-link"
            aria-label="Makra Labs on GitHub"
          >
            <svg
              className="makra-navbar__icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1 .1 1.6 1.1 1.6 1.1 1 1.7 2.6 1.2 3.2 1 .1-.7.4-1.2.7-1.5-2.7-.3-5.6-1.3-5.6-5.9 0-1.3.5-2.3 1.1-3.2-.1-.3-.5-1.5.1-3 0 0 1-.3 3.3 1.1a11.6 11.6 0 0 1 6 0c2.3-1.4 3.3-1.1 3.3-1.1.6 1.5.2 2.7.1 3 .7.9 1.1 1.9 1.1 3.2 0 4.6-2.9 5.6-5.6 5.9.4.4.8 1 .8 2v2.9c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
