"use client";

import Image from "next/image";

export function Footer() {
  return (
    <footer
      className="grainy-background py-12 px-0 flex flex-col items-center justify-center"
      style={{ backgroundColor: "var(--makra-background-dark-200)" }}
    >
      <div className="w-[80%] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Image
            src="/logo/192x192.png"
            alt="Makra Labs Logo"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <div
            className="text-xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-cormorant)",
              color: "var(--makra-foreground-light)",
            }}
          >
            Makra
            <span style={{ color: "var(--makra-primary-green-100)" }}>
              labs
            </span>
          </div>
        </div>
        <p
          className="text-sm"
          style={{
            fontFamily: "var(--font-open-sans)",
            color: "var(--makra-foreground-light-200)",
          }}
        >
          &copy; 2025 Makra Labs
        </p>
      </div>
    </footer>
  );
}
