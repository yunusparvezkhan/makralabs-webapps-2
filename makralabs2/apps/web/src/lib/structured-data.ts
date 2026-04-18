import type { WithContext, Organization, SoftwareApplication, WebSite } from "schema-dts";
import { env } from "@/lib/env";

const baseUrl = env.NEXT_PUBLIC_SITE_URL;

export const organizationSchema: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Makra Labs",
  url: baseUrl,
  logo: `${baseUrl}/logo/192x192.png`,
  description:
    "Building AI-powered tools for developers. Creators of Makra, a memory layer for AI agents.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "ping@makralabs.org",
    contactType: "customer support",
  },
};

export const websiteSchema: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Makra",
  url: baseUrl,
  description:
    "Memory Layer Between the Web and AI. Save tokens with smart retrieval instead of raw HTML.",
  publisher: {
    "@type": "Organization",
    name: "Makra Labs",
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/logo/192x192.png`,
    },
  },
};

export const productSchema: WithContext<SoftwareApplication> = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Makra",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Cross-platform",
  description:
    "Makra is a memory layer between the web and your AI agents. Save tokens by using smart retrieval instead of dumping raw HTML into context windows.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  author: {
    "@type": "Organization",
    name: "Makra Labs",
    url: baseUrl,
  },
};
