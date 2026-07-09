import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-24 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-charcoal/20 focus:ring-2",
      className,
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
