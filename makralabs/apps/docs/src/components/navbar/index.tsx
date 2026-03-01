import Link from "next/link";

type NavbarLink = {
  href: string;
  label: string;
};

export function Navbar({ links }: { links: NavbarLink[] }) {
  return (
    <nav
      className="w-screen flex justify-center"
      style={{
        height: "66px",
        backgroundColor: "var(--makra-background-light)",
      }}
    >
      <div className="h-full w-[80%] flex flex-row items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span
            className="font-bold"
            style={{
              fontSize: "1.75rem",
              fontFamily: "var(--font-cormorant)",
              color: "var(--makra-primary-green)",
              lineHeight: 1,
            }}
          >
            Makra
          </span>
          <span className="text-sm text-black/60">Docs</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => (
            link.href.startsWith("http") ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-black/80 hover:text-black transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className="text-black/80 hover:text-black transition-colors">
                {link.label}
              </Link>
            )
          ))}
          <a
            className="makra-web-btn-green rounded-md px-4 py-2 text-sm font-semibold"
            href="https://makralabs.org"
            target="_blank"
            rel="noreferrer"
          >
            Get Makra
          </a>
        </div>
      </div>
    </nav>
  );
}
