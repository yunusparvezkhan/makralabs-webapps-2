import Link from "next/link";

export function DashboardAuthPageShell({
  title,
  subtitle,
  children,
  footer
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="dash-auth-root">
      <section className="dash-auth-brand">
        <p className="dash-eyebrow">Makra Dashboard</p>
        <h1>Manage API keys and credits in one place.</h1>
        <p className="dash-muted">
          Backend target is <code>http://localhost:8080</code>. Sign in to create API keys, monitor credit usage, and
          test API-key authenticated calls.
        </p>
        <Link href="/" className="dash-ghost-link">
          Back to marketing page
        </Link>
      </section>
      <section className="dash-panel dash-auth-panel">
        <div>
          <h2>{title}</h2>
          <p className="dash-muted">{subtitle}</p>
        </div>
        {children}
        {footer ? <div className="dash-auth-footer">{footer}</div> : null}
      </section>
    </main>
  );
}
