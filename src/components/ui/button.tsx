import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "destructive" | "ghost" | "accent";
  size?: "default" | "sm" | "lg";
};

const variants = {
  default: "bg-charcoal text-white hover:bg-charcoal/90",
  secondary: "bg-white/80 text-charcoal hover:bg-white",
  outline: "border border-black/10 bg-transparent hover:bg-white/60",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  ghost: "hover:bg-black/5",
  accent: "bg-lavender text-charcoal hover:bg-lavender-dark",
};

const sizes = {
  default: "h-10 px-5 py-2",
  sm: "h-8 px-4 text-sm",
  lg: "h-12 px-8",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
