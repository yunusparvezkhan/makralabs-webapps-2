"use client";

import { useCallback, useMemo, useState } from "react";

export function CopyPageButton({ href }: { href: string }) {
  const [copied, setCopied] = useState(false);

  const label = useMemo(() => (copied ? "Copied" : "Copy link"), [copied]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1000);
    } catch {
      // ignore
    }
  }, [href]);

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition hover:bg-black/5"
      aria-label="Copy link to this page"
    >
      {label}
    </button>
  );
}

