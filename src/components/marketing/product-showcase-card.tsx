"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { HoverLift } from "@/components/motion/primitives";
import { ImageScrim, textOnImageClassName } from "@/components/ui/image-scrim";

type ProductShowcaseCardProps = {
  name: string;
  category: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
};

export function ProductShowcaseCard({
  name,
  category,
  description,
  imageSrc,
  imageAlt,
  href = "/shop",
}: ProductShowcaseCardProps) {
  const reduceMotion = useReducedMotion();
  const [firstWord, ...restWords] = name.split(" ");
  const restName = restWords.join(" ");

  return (
    <HoverLift>
      <motion.article
        className="group flex flex-col overflow-hidden rounded-[2rem] bg-white/60"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-[2rem] md:min-h-[28rem]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <ImageScrim variant="card" />
          <div className={cn("relative z-10 space-y-3 p-6 text-white md:p-8", textOnImageClassName())}>
            <p className="text-xs font-medium tracking-[0.2em] text-white/80 uppercase">{category}</p>
            <h3 className="font-serif-display text-3xl leading-tight text-white md:text-4xl">
              {restName ? (
                <>
                  <em className="text-white italic">{firstWord}</em>{" "}
                  <span className="text-white">{restName}</span>
                </>
              ) : (
                <em className="text-white italic">{firstWord}</em>
              )}
            </h3>
            <p className="max-w-xs text-sm leading-relaxed text-white/90">{description}</p>
            <Link
              href={href}
              className="inline-flex rounded-full bg-[#f7f4ef] px-5 py-2.5 text-sm font-medium text-charcoal transition hover:bg-white"
            >
              Shop now
            </Link>
          </div>
        </div>
      </motion.article>
    </HoverLift>
  );
}
