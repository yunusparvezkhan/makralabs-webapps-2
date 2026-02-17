"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen min-w-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
