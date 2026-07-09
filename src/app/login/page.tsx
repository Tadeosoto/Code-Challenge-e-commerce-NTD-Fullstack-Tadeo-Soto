"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SectionHeading } from "@/components/marketing/section-heading";
import { useAuth } from "@/lib/auth/auth-context";
import { ROLE_OPTIONS, type DemoRole } from "@/lib/auth/role-options";
import { useFeedback } from "@/lib/feedback/feedback-context";

function getRedirectPath(role: DemoRole) {
  if (role === "OWNER") return "/owner/approvals";
  if (role === "SELLER") return "/seller/products";
  return "/shop";
}

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const { showSuccess, showError } = useFeedback();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleRoleSelect(role: DemoRole) {
    setLoading(role);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    setLoading(null);
    const data = await response.json();

    if (!response.ok) {
      showError(data.error ?? "Login failed");
      return;
    }

    await refresh();
    showSuccess(data.message);
    router.push(getRedirectPath(role));
  }

  return (
    <div className="mx-auto max-w-2xl pb-16">
      <SectionHeading
        align="left"
        eyebrow="Account"
        title="Choose your role"
        italicWord="role"
        description="Explore the different roles of the demo."
      />

      <div className="mt-10 space-y-4">
        {ROLE_OPTIONS.map(({ role, title, description, icon: Icon }) => (
          <button
            key={role}
            type="button"
            disabled={loading !== null}
            onClick={() => handleRoleSelect(role)}
            className="flex w-full items-start gap-5 rounded-[2rem] border border-black/5 bg-white/70 p-6 text-left transition hover:border-lavender-dark hover:bg-white disabled:opacity-60"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lavender text-charcoal">
              <Icon className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="font-serif-display text-xl">{title}</span>
              <span className="font-mono-body mt-1 block text-sm text-muted">{description}</span>
            </span>
            <span className="shrink-0 rounded-full bg-lavender px-4 py-2 text-sm font-semibold text-charcoal">
              {loading === role ? "Signing in..." : "Continue"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
