import type { Metadata } from "next";
import "./globals.css";
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
