import type { Metadata } from "next";
import { DocsShell } from "@/components/docs/DocsShell";
import { Footer } from "@/components/footer";
import { loadDocsConfig } from "@/lib/docs/config";

export const metadata: Metadata = {
  title: {
    default: "Makra Docs",
    template: "%s | Makra Docs",
  },
  description: "Documentation site for MakraLabs products and APIs.",
};

export default async function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await loadDocsConfig();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <DocsShell config={config}>{children}</DocsShell>
      </main>
      <Footer />
    </div>
  );
}
