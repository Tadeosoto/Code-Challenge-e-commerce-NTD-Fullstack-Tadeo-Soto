"use client";

import { FadeIn } from "@/components/motion/primitives";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  italicWord?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  animated?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  italicWord,
  description,
  align = "center",
  className,
  animated = true,
}: SectionHeadingProps) {
  const titleParts = italicWord ? title.split(italicWord) : [title];

  const content = (
    <div
      className={cn(
        "space-y-4",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex rounded-full bg-charcoal px-4 py-1.5 text-xs font-medium tracking-wide text-white uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-serif-display text-4xl leading-tight font-normal text-charcoal md:text-5xl lg:text-6xl">
        {italicWord && titleParts.length > 1 ? (
          <>
            {titleParts[0]}
            <em className="italic">{italicWord}</em>
            {titleParts[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {description ? (
        <p className="font-mono-body text-sm leading-relaxed text-muted md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );

  if (!animated) return content;
  return <FadeIn>{content}</FadeIn>;
}
