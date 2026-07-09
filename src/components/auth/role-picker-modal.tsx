"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionHeading } from "@/components/marketing/section-heading";
import { useAuth } from "@/lib/auth/auth-context";
import {
  ROLE_OPTIONS,
  ROLE_PICKER_DISMISSED_KEY,
  type DemoRole,
} from "@/lib/auth/role-options";
import { useFeedback } from "@/lib/feedback/feedback-context";

function getRedirectPath(role: DemoRole) {
  if (role === "OWNER") return "/owner/approvals";
  if (role === "SELLER") return "/seller/products";
  return "/shop";
}

export function RolePickerModal() {
  const router = useRouter();
  const { user, loading, refresh } = useAuth();
  const { showSuccess, showError } = useFeedback();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState<DemoRole | null>(null);

  useEffect(() => {
    if (loading || user) return;

    const dismissed = sessionStorage.getItem(ROLE_PICKER_DISMISSED_KEY);
    if (!dismissed) {
      setOpen(true);
    }
  }, [loading, user]);

  function dismissModal() {
    sessionStorage.setItem(ROLE_PICKER_DISMISSED_KEY, "1");
    setOpen(false);
  }

  async function handleRoleSelect(role: DemoRole) {
    setSubmitting(role);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    setSubmitting(null);
    const data = await response.json();

    if (!response.ok) {
      showError(data.error ?? "Login failed");
      return;
    }

    sessionStorage.setItem(ROLE_PICKER_DISMISSED_KEY, "1");
    setOpen(false);
    await refresh();
    showSuccess(data.message);
    router.push(getRedirectPath(role));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Choose your role"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-black/5 bg-cream p-6 shadow-2xl md:p-8"
      >
        <SectionHeading
          align="left"
          animated={false}
          title="Choose your role"
          italicWord="role"
          description="Explore the different roles of the demo."
        />

        <div className="mt-8 space-y-4">
          {ROLE_OPTIONS.map(({ role, title, description, icon: Icon }) => (
            <button
              key={role}
              type="button"
              disabled={submitting !== null}
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
                {submitting === role ? "Signing in..." : "Continue"}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            disabled={submitting !== null}
            onClick={dismissModal}
            className="rounded-full border border-black/10 bg-white px-6 py-2.5 text-sm font-semibold text-charcoal transition hover:border-lavender-dark hover:bg-lavender/30 disabled:opacity-60"
          >
            I just want to see
          </button>
        </div>
      </div>
    </div>
  );
}
