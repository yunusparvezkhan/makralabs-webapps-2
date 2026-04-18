import type { Metadata } from "next";
import { ContactEmailCopy } from "@/components/contact-email-copy";

const email = ["ping", "makralabs.org"].join("@");

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach out to Makra Labs.",
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="makra-page-width contact-page__inner" aria-labelledby="contact-title">
        <div className="contact-page__eyebrow">
          <span className="contact-page__eyebrow-line" aria-hidden="true" />
          <span>Contact</span>
        </div>

        <h1 id="contact-title" className="contact-page__headline home-hero-headline">
          Say Hello!
        </h1>

        <p className="contact-page__copy">
          For beta access, questions, or anything you want to discuss, reach out
          to us at <ContactEmailCopy email={email} />
          .
        </p>
      </section>
    </main>
  );
}
