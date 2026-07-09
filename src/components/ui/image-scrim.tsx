import { cn } from "@/lib/utils";

export type ImageScrimVariant = "hero" | "card" | "banner" | "panel";

const scrimVariants: Record<ImageScrimVariant, string> = {
  hero: "image-scrim-hero",
  card: "image-scrim-card",
  banner: "image-scrim-banner",
  panel: "image-scrim-panel",
};

type ImageScrimProps = {
  variant?: ImageScrimVariant;
  className?: string;
};

export function ImageScrim({ variant = "card", className }: ImageScrimProps) {
  return (
    <>
      <div className={cn("image-scrim-base", className)} aria-hidden />
      <div className={cn("image-scrim-layer", scrimVariants[variant])} aria-hidden />
    </>
  );
}

export function textOnImageClassName() {
  return "text-on-image";
}
