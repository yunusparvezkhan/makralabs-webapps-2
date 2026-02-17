import type { Metadata } from "next";
import { Cormorant_Garamond, Open_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";
import { env } from "@/lib/env";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Makra - Memory Layer Between the Web and AI | Save Tokens with Smart Retrieval",
    template: "%s | Makra",
  },
  description:
    "Makra is a memory layer between the web and your AI agents. Stop wasting tokens on raw HTML. Get the same quality results with smart retrieval. Built for AI developers.",
  keywords: [
    "AI agents",
    "token optimization",
    "AI memory layer",
    "web scraping for AI",
    "LLM context optimization",
    "AI retrieval",
    "token saving",
    "AI developer tools",
    "structured data extraction",
    "web data for AI",
  ],
  authors: [{ name: "Makra Labs" }],
  creator: "Makra Labs",
  publisher: "Makra Labs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Makra",
    title: "Makra - Memory Layer Between the Web and AI",
    description:
      "Save tokens by using smart retrieval instead of raw HTML. Makra handles the context, so your AI agents can focus on the data.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Makra - Memory Layer Between the Web and AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Makra - Memory Layer Between the Web and AI",
    description:
      "Save tokens by using smart retrieval instead of raw HTML. Built for AI developers.",
    images: ["/twitter-image.png"],
    creator: "@makralabs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo/192x192.png",
    apple: "/logo/192x192.png",
    shortcut: "/logo/192x192.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${openSans.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
