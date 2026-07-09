"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";
import { useFeedback } from "@/lib/feedback/feedback-context";
import { getDemoUsername, ROLE_OPTIONS, type DemoRole } from "@/lib/auth/role-options";

function getRedirectPath(role: DemoRole) {
  if (role === "OWNER") return "/owner/approvals";
  if (role === "SELLER") return "/seller/products";
  return "/shop";
}

type DemoLoginFormProps = {
  footer?: ReactNode;
  onSuccess?: () => void;
};

export function DemoLoginForm({ footer, onSuccess }: DemoLoginFormProps) {
  const router = useRouter();
  const { refresh } = useAuth();
  const { showSuccess, showError } = useFeedback();
  const [role, setRole] = useState<DemoRole | "">("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedOption = useMemo(
    () => ROLE_OPTIONS.find((option) => option.role === role),
    [role],
  );

  const username = role ? getDemoUsername(role) : "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!role) {
      showError("Please select a role.");
      return;
    }

    if (!password) {
      showError("Please enter the demo password.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, username, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        showError(data.error ?? "Login failed");
        return;
      }

      await refresh();
      showSuccess(data.message);
      onSuccess?.();
      router.push(getRedirectPath(role));
    } catch {
      showError("Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-3xl border border-lavender-dark/40 bg-lavender/25 px-4 py-3">
        <p className="font-mono-body text-sm text-charcoal">
          Demo credentials for each role are listed in the <span className="font-semibold">README</span>.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Role <span className="text-red-500">*</span>
        </label>
        <select
          required
          value={role}
          onChange={(event) => setRole(event.target.value as DemoRole | "")}
          className="h-11 w-full rounded-full border border-black/10 bg-white px-4 text-sm outline-none ring-charcoal/20 focus:ring-2"
        >
          <option value="" disabled>
            Select role
          </option>
          {ROLE_OPTIONS.map((option) => (
            <option key={option.role} value={option.role}>
              {option.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Username</label>
        <Input
          value={username}
          readOnly
          placeholder="Select a role first"
          className="bg-cream"
          aria-readonly="true"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Password <span className="text-red-500">*</span>
        </label>
        <Input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter the demo password"
          autoComplete="current-password"
          className="bg-cream"
        />
      </div>

      {selectedOption ? (
        <div className="rounded-3xl border border-black/5 bg-white/70 p-4">
          <p className="font-serif-display text-lg">{selectedOption.title}</p>
          <p className="font-mono-body mt-1 text-sm text-muted">{selectedOption.description}</p>
        </div>
      ) : null}

      <Button type="submit" variant="accent" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign in"}
      </Button>

      {footer ? <div className="pt-2">{footer}</div> : null}
    </form>
  );
}
