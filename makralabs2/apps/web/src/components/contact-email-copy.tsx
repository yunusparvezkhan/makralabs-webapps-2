"use client";

import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

export function ContactEmailCopy({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className="contact-page__email-wrap">
      <a href={`mailto:${email}`} className="font-medium old-school-link contact-page__email">
        {email}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className={["contact-page__copy-button", copied ? "contact-page__copy-button--copied" : ""]
          .filter(Boolean)
          .join(" ")}
        title={copied ? "Copied!" : "Copy email"}
        aria-label={copied ? "Email copied" : "Copy email"}
      >
        {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
      </button>
    </span>
  );
}
