import type { Metadata } from "next";
import "./globals.css";
import { DocsShell } from "@/components/docs/DocsShell";
import { loadDocsConfig } from "@/lib/docs/config";
import { env } from "@/lib/env";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Makra Docs",
    template: "%s | Makra Docs"
  },
  description: "Documentation site for MakraLabs products and APIs."
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const config = await loadDocsConfig();

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <DocsShell config={config}>{children}</DocsShell>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
