"use client";

import { FormEvent, useState } from "react";
import { BRAND_SHORT } from "@/lib/site-content";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const trimmed = email.trim();
  const valid = isValidEmail(trimmed);
  const showInvalid = !valid && (trimmed.length > 0 || submitAttempted);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!valid) {
      setSubmitAttempted(true);
      return;
    }
    setSubmitAttempted(false);
    setSuccess(true);
    setEmail("");
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (success) setSuccess(false);
    if (submitAttempted && isValidEmail(value.trim())) setSubmitAttempted(false);
  }

  return (
    <div className="mx-auto max-w-xl text-center">
      <h2 className="font-serif-display text-3xl md:text-4xl">
        Get <em className="italic">Updates</em> From {BRAND_SHORT}
      </h2>
      <form className="mt-6 flex overflow-hidden rounded-full bg-white/10 p-1" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => handleEmailChange(event.target.value)}
          className="flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder:text-white/50 outline-none"
          aria-invalid={showInvalid}
          aria-describedby={showInvalid ? "footer-email-error" : success ? "footer-email-success" : undefined}
        />
        <button
          type="submit"
          className="rounded-full bg-lavender px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-lavender-dark"
        >
          Sign Up
        </button>
      </form>

      {showInvalid ? (
        <p id="footer-email-error" className="mt-3 text-sm text-red-400">
          Please enter a valid email address.
        </p>
      ) : null}

      {success ? (
        <p id="footer-email-success" className="mt-3 text-sm text-emerald-400">
          Thanks! You&apos;re signed up for updates.
        </p>
      ) : null}

      <p className="font-mono-body mt-4 text-xs text-white/60">
        be the first to know about new products, restocks on electronics, and exclusive offers.
      </p>
    </div>
  );
}
