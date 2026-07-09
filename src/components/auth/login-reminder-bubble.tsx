"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const LOGIN_REMINDER_DISMISSED_KEY = "ntd-login-reminder-dismissed";

type LoginReminderBubbleProps = {
  className?: string;
};

export function LoginReminderBubble({ className }: LoginReminderBubbleProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(LOGIN_REMINDER_DISMISSED_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  function dismiss(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    sessionStorage.setItem(LOGIN_REMINDER_DISMISSED_KEY, "1");
    setVisible(false);
  }

  return (
    <div className={cn("relative", className)}>
      <Link
        href="/login"
        aria-label="Log in"
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-2 transition hover:bg-white/10 sm:px-3"
      >
        <User className="h-4 w-4" aria-hidden />
        <span className="hidden text-sm font-medium sm:inline">Login</span>
      </Link>

      {visible ? (
        <div
          className="absolute top-full right-0 z-50 mt-2 w-52 rounded-xl border border-white/10 bg-white px-3 py-2.5 text-charcoal shadow-xl"
          role="status"
        >
          <span
            aria-hidden
            className="absolute -top-1.5 right-4 h-3 w-3 rotate-45 border-t border-l border-white/10 bg-white"
          />
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-1.5 right-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-charcoal/50 transition hover:bg-charcoal/5 hover:text-charcoal"
            aria-label="Dismiss login reminder"
          >
            <X className="h-3 w-3" />
          </button>
          <p className="pr-4 text-xs leading-snug font-medium">
            Log in to unlock shopping, selling, and owner tools.
          </p>
        </div>
      ) : null}
    </div>
  );
}
