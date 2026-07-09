"use client";

import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  title: string;
  message: string;
  variant?: "success" | "error" | "info";
  onClose: () => void;
};

export function Modal({ open, title, message, variant = "info", onClose }: ModalProps) {
  if (!open) return null;

  const variantStyles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-red-200 bg-red-50 text-red-900",
    info: "border-lavender-dark bg-lavender/30 text-charcoal",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full max-w-md rounded-[2rem] border p-8 shadow-xl",
          variantStyles[variant],
        )}
      >
        <h2 className="font-serif-display text-2xl">{title}</h2>
        <p className="font-mono-body mt-3 text-sm leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex rounded-full bg-charcoal px-6 py-2.5 text-sm font-semibold text-white"
        >
          OK
        </button>
      </div>
    </div>
  );
}
