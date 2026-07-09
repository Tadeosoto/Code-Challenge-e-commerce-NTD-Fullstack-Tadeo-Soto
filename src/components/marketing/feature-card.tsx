"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { HoverLift } from "@/components/motion/primitives";

type FeatureCardProps = {
  title: string;
  tagline: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function FeatureCard({
  title,
  tagline,
  description,
  imageSrc,
  imageAlt,
}: FeatureCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <HoverLift className="h-full">
      <motion.article
        className="flex h-full min-w-[18rem] shrink-0 flex-1 flex-col overflow-hidden rounded-[2rem] border border-black/5 bg-white/70 md:min-w-[20rem]"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {imageSrc ? (
          <div className="relative h-40 w-full">
            <Image src={imageSrc} alt={imageAlt ?? title} fill sizes="320px" className="object-cover" />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col p-6 md:p-8">
          <h3 className="font-serif-display text-2xl text-charcoal">{title}</h3>
          <p className="mt-2 text-sm font-medium text-charcoal/80">{tagline}</p>
          <p className="font-mono-body mt-4 text-sm leading-relaxed text-muted">{description}</p>
        </div>
      </motion.article>
    </HoverLift>
  );
}
