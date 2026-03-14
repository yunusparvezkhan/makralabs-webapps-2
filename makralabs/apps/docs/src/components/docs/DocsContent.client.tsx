"use client";

import { startTransition, type MouseEvent } from "react";
import { useRouter } from "next/navigation";

function shouldHandleInternalNavigation(event: MouseEvent<HTMLDivElement>, anchor: HTMLAnchorElement) {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return false;

  const url = new URL(anchor.href, window.location.href);
  if (!/^https?:$/.test(url.protocol)) return false;
  if (url.origin !== window.location.origin) return false;

  const currentUrl = new URL(window.location.href);
  if (url.pathname === currentUrl.pathname && url.search === currentUrl.search && url.hash) {
    return false;
  }

  return true;
}

export function DocsContent({ html }: { html: string }) {
  const router = useRouter();

  return (
    <div
      id="docs-content"
      className="docs-prose"
      onClick={(event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const anchor = target.closest("a");
        if (!(anchor instanceof HTMLAnchorElement)) return;
        if (!shouldHandleInternalNavigation(event, anchor)) return;

        event.preventDefault();
        const nextUrl = new URL(anchor.href, window.location.href);

        startTransition(() => {
          router.push(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
        });
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
