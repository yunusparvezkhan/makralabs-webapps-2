"use client";

import type { ComponentType, ReactNode } from "react";

export interface FooterProps {
  logoUrl?: string;
  homeHref?: string;
  brandName?: string;
  brandAccent?: string;
  copyrightText?: string;
  LinkComponent?: ComponentType<{
    href: string;
    className?: string;
    children: ReactNode;
  }>;
}

export function Footer({
  logoUrl = "/logo/192x192.png",
  homeHref = "/",
  brandName = "Makra",
  brandAccent = "labs",
  copyrightText,
  LinkComponent,
}: FooterProps) {
  const InternalLink = LinkComponent;
  const copy =
    copyrightText ?? `\u00A9 ${new Date().getFullYear()} Makra Labs`;

  const brand = (
    <div className="makra-footer__brand">
      <img
        src={logoUrl}
        alt="Makra Labs Logo"
        width={24}
        height={24}
        className="makra-footer__logo"
      />
      <div className="makra-footer__title">
        {brandName}
        <span className="makra-footer__title-accent">{brandAccent}</span>
      </div>
    </div>
  );

  return (
    <footer className="makra-footer">
      <div className="makra-footer__inner">
        {InternalLink ? (
          <InternalLink href={homeHref} className="">
            {brand}
          </InternalLink>
        ) : (
          <a href={homeHref} className="">
            {brand}
          </a>
        )}
        <p className="makra-footer__copy">{copy}</p>
      </div>
    </footer>
  );
}
