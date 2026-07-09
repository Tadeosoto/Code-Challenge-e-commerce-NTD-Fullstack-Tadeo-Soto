import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none ring-charcoal/20 focus:ring-2",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
