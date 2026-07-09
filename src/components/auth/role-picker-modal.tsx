"use client";

import { useEffect, useState } from "react";
import { DemoLoginForm } from "@/components/auth/demo-login-form";
import { SectionHeading } from "@/components/marketing/section-heading";
import { useAuth } from "@/lib/auth/auth-context";
import { ROLE_PICKER_DISMISSED_KEY } from "@/lib/auth/role-options";

export function RolePickerModal() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Choose your role"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-4xl border border-black/5 bg-cream p-6 shadow-2xl md:p-8"
      >
        <SectionHeading
          align="left"
          animated={false}
          title="Sign in to a role"
          italicWord="role"
          description="Select a role on your first visit, enter the demo password, or continue as a guest."
        />

        <div className="mt-8">
          <DemoLoginForm
            onSuccess={() => {
              sessionStorage.setItem(ROLE_PICKER_DISMISSED_KEY, "1");
              setOpen(false);
            }}
            footer={
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={dismissModal}
                  className="rounded-full border border-black/10 bg-white px-6 py-2.5 text-sm font-semibold text-charcoal transition hover:border-lavender-dark hover:bg-lavender/30"
                >
                  I just want to see
                </button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
