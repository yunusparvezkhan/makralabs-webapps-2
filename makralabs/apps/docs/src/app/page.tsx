import Link from "next/link";
import { Button, Card } from "@makralabs/ui";

export default function DocsHomePage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "56px 20px" }}>
      <Card>
        <h1 style={{ marginTop: 0, fontSize: "2rem" }}>Makra Documentation</h1>
        <p>Monorepo docs app is running on <code>apps/docs</code>.</p>
        <p>Shared UI package is imported from <code>@makralabs/ui</code>.</p>
        <div style={{ marginTop: 20 }}>
          <Link href="/getting-started">
            <Button>Getting Started</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
