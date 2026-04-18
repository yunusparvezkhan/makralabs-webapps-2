"use client";

import { useEffect, useId, useState } from "react";
import type { ComponentType, MouseEvent, ReactNode } from "react";

export interface NavbarLink {
    href: string;
    label: string;
    newTab?: boolean;
}

export interface NavbarProps {
    logoUrl?: string;
    homeHref?: string;
    brandSuffix?: string;
    twitterUrl?: string;
    githubUrl?: string;
    isSignedIn?: boolean;
    links?: NavbarLink[];
    LinkComponent?: ComponentType<{
        href: string;
        className?: string;
        onClick?: () => void;
        children: ReactNode;
    }>;
    mobileMenuContent?: ReactNode;
}

export const DEFAULT_NAVBAR_LINKS: NavbarLink[] = [
    { href: "/docs", label: "Docs", newTab: false },
    { href: "/contact", label: "Contact", newTab: false },
];

export const DOCS_NAVBAR_LINKS: NavbarLink[] = [
    { href: "https://makralabs.org/docs", label: "Docs", newTab: false },
    { href: "https://makralabs.org/contact", label: "Contact", newTab: false },
];

export function Navbar({
    logoUrl = "/logo/192x192.png",
    homeHref = "/",
    brandSuffix,
    twitterUrl = "https://twitter.com/makralabs",
    githubUrl = "https://github.com/makralabs",
    isSignedIn = false,
    links = DEFAULT_NAVBAR_LINKS,
    LinkComponent,
    mobileMenuContent,
}: NavbarProps) {
    const InternalLink = LinkComponent;
    const mobileMenuId = useId();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const authHref = isSignedIn
        ? "/dashboard"
        : "/login";

    const renderInternalLink = ({
        href,
        className,
        onClick,
        children,
    }: {
        href: string;
        className: string;
        onClick?: () => void;
        children: ReactNode;
    }) =>
        InternalLink ? (
            <InternalLink href={href} className={className} onClick={onClick}>
                {children}
            </InternalLink>
        ) : (
            <a href={href} className={className} onClick={onClick}>
                {children}
            </a>
        );

    const closeMobileMenu = () => setMobileMenuOpen(false);

    useEffect(() => {
        if (!mobileMenuOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeMobileMenu();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [mobileMenuOpen]);

    const handleMobilePanelClick = (event: MouseEvent<HTMLDivElement>) => {
        const target = event.target;
        if (target instanceof Element && target.closest("a")) {
            closeMobileMenu();
        }
    };

    const renderNavbarLink = (
        link: NavbarLink,
        className = "makra-navbar__link",
        onClick?: () => void,
    ) => {
        if (link.newTab) {
            return (
                <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                    onClick={onClick}
                >
                    {link.label}
                </a>
            );
        }

        if (link.href.startsWith("http")) {
            return (
                <a
                    key={link.href}
                    href={link.href}
                    className={className}
                    onClick={onClick}
                >
                    {link.label}
                </a>
            );
        }

        return (
            <span key={link.href}>
                {renderInternalLink({
                    href: link.href,
                    className,
                    onClick,
                    children: link.label,
                })}
            </span>
        );
    };

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
                                    <span className="makra-navbar__title-accent">
                                        labs
                                    </span>
                                    {brandSuffix ? (
                                        <span className="makra-navbar__title-suffix">
                                            {brandSuffix}
                                        </span>
                                    ) : null}
                                </div>
                            </>
                        ),
                    })}
                </div>

                <div className="makra-navbar__links">
                    {links.length > 0 && (
                        <div className="makra-navbar__links">
                            {links.map((link) => renderNavbarLink(link))}
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

                    {/* <a href={authHref} className="makra-navbar__cta" style={{
                      marginLeft: 0
                    }}>
                        {isSignedIn ? "Dashboard" : "Sign In"}
                    </a> */}
                </div>

                <button
                    type="button"
                    className="makra-navbar__menu-button"
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileMenuOpen}
                    aria-controls={mobileMenuId}
                    onClick={() => setMobileMenuOpen((open) => !open)}
                >
                    <span className="makra-navbar__menu-line" />
                    <span className="makra-navbar__menu-line" />
                    <span className="makra-navbar__menu-line" />
                </button>
            </div>

            {mobileMenuOpen ? (
                <div
                    id={mobileMenuId}
                    className="makra-navbar__mobile-panel makra-navbar__mobile-panel--open"
                    onClick={handleMobilePanelClick}
                >
                    <div className="makra-navbar__mobile-card">
                        {links.length > 0 ? (
                            <div className="makra-navbar__mobile-links">
                                {links.map((link) =>
                                    renderNavbarLink(link, "makra-navbar__mobile-link", closeMobileMenu),
                                )}
                            </div>
                        ) : null}

                        <div className="makra-navbar__mobile-social">
                            <a
                                href={twitterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="makra-navbar__mobile-link"
                                aria-label="Makra Labs on X"
                            >
                                X
                            </a>
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="makra-navbar__mobile-link"
                                aria-label="Makra Labs on GitHub"
                            >
                                GitHub
                            </a>
                        </div>

                        {mobileMenuContent ? (
                            <div className="makra-navbar__mobile-extra">
                                {mobileMenuContent}
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </nav>
    );
}
