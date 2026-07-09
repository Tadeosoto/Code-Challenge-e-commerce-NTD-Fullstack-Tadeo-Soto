"use client";

import { DemoLoginForm } from "@/components/auth/demo-login-form";
import { SectionHeading } from "@/components/marketing/section-heading";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-2xl pb-16">
      <SectionHeading
        align="left"
        eyebrow="Account"
        title="Sign in to a role"
        italicWord="role"
        description="Select a demo role, use its matching username, and enter the demo password from the README."
      />

      <div className="mt-10 rounded-4xl border border-black/5 bg-white/70 p-6 md:p-8">
        <DemoLoginForm />
      </div>
    </div>
  );
}
