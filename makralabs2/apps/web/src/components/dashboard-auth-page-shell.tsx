import Link from "next/link";
import Image from "next/image";
// import logoUrl from "public/logo/192x192.png";

export function DashboardAuthPageShell({
  logoUrl = "/logo/192x192.png",
  title,
  subtitle,
  children,
  footer,
}: {
  logoUrl?: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="dash-auth-root">
      {/* ── Left Brand Panel ── */}
      <section className="dash-auth-brand">
        {/* Logo lockup */}
        <Link href="/" className="dash-auth-logo-link" aria-label="Back to MakraLabs home">
          <Image
            src={logoUrl}
            alt="Makra Labs Logo"
            width={28}
            height={28}
            className="makra-navbar__logo"
          />
          <span className="dash-auth-logo-wordmark">Makralabs</span>
        </Link>

        {/* Eyebrow */}
        <p className="dash-eyebrow">For AI Developers</p>

        {/* Value headline */}
        <h1 className="dash-auth-brand-headline">
          Save Your Tokens.<br />
          <span className="dash-auth-brand-accent">Focus on the Data.</span>
        </h1>

        {/* Description */}
        <p className="dash-muted dash-auth-brand-body">
          Makra is a memory layer between the web and your AI agents. We handle
          the context — retrieve exactly what you need, without dumping raw HTML
          into your context window.
        </p>

        {/* Stat row */}
        <div className="dash-auth-stat-row">
          <div className="dash-auth-stat">
            <span className="dash-auth-stat-value">5×</span>
            <span className="dash-auth-stat-label">fewer tokens</span>
          </div>
          <div className="dash-auth-stat-divider" />
          <div className="dash-auth-stat">
            <span className="dash-auth-stat-value">API</span>
            <span className="dash-auth-stat-label">key access</span>
          </div>
          <div className="dash-auth-stat-divider" />
          <div className="dash-auth-stat">
            <span className="dash-auth-stat-value">REST</span>
            <span className="dash-auth-stat-label">first-class</span>
          </div>
        </div>

        {/* Back link */}
        <Link href="/" className="dash-ghost-link">
          ← Back to marketing page
        </Link>
      </section>

      {/* ── Right Form Panel ── */}
      <section className="dash-panel dash-auth-panel">
        <div className="dash-auth-panel-header">
          <h2 className="dash-auth-panel-title">{title}</h2>
          <p className="dash-muted">{subtitle}</p>
        </div>
        {children}
        {footer ? <div className="dash-auth-footer">{footer}</div> : null}
      </section>
    </main>
  );
}
