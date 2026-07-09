"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { siteImages } from "@/lib/site-images";
import { FadeIn } from "@/components/motion/primitives";
import { ImageScrim, textOnImageClassName } from "@/components/ui/image-scrim";

export function HomeHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative mx-4 overflow-hidden rounded-[2.5rem] md:mx-6 md:min-h-[34rem]">
      <Image
        src={siteImages.heroCommerce.src}
        alt={siteImages.heroCommerce.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0">
        <ImageScrim variant="hero" />
      </div>

      <motion.div
        className={cn(
          "relative z-10 flex min-h-[34rem] flex-col justify-end px-6 py-12 md:px-12 md:py-16",
          textOnImageClassName(),
        )}
        initial={reduceMotion ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-mono-body text-sm tracking-[0.18em] text-white/80 uppercase">
          NTD Commerce challenge by Tadeo Soto
        </p>
        <h1 className="font-serif-display mt-4 max-w-3xl text-5xl leading-[1.05] text-white md:text-7xl">
          Commerce is <em className="italic">Personal</em>
        </h1>
        <p className="font-mono-body mt-6 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
          the enterprise e-commerce platform for discovering Running Shoes, Bluetooth Speakers,
          Standing Desks, and everything in between — with search, import, and mock checkout built
          in.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="inline-flex rounded-full bg-lavender px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-lavender-dark"
          >
            Shop catalog
          </Link>
          <Link
            href="/why-us"
            className="inline-flex rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Why us
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export function HomeIntelligencePanel() {
  return (
    <FadeIn className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/60">
      <div className="relative h-52 w-full md:h-60">
        <Image
          src={siteImages.personalizedShopping.src}
          alt={siteImages.personalizedShopping.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
      </div>
      <div className="p-8 md:p-10">
        <h3 className="font-serif-display text-2xl">
          Understand <em className="italic">everyday</em> shopping
        </h3>
        <p className="font-mono-body mt-4 text-sm leading-relaxed text-muted">
          our platform transforms product data — SKUs, categories, stock levels — into a seamless
          storefront. import csv catalogs, validate edge cases, and checkout with confidence.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-charcoal/90"
        >
          Explore the shop
        </Link>
      </div>
    </FadeIn>
  );
}

export function HomeCtaSection() {
  return (
    <FadeIn>
      <div className="relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center md:px-12">
        <Image
          src={siteImages.ctaShopping.src}
          alt={siteImages.ctaShopping.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]" />
        <div className="relative z-10">
          <h2 className="font-serif-display text-4xl md:text-5xl">
            NTD Commerce, because shopping is <em className="italic">personal</em>
          </h2>
          <p className="font-mono-body mx-auto mt-4 max-w-2xl text-sm text-muted">
            browse accessories, sports gear, kitchen essentials, and more. add to cart, complete mock
            payment, and receive instant order confirmation.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-full bg-lavender px-8 py-3.5 text-sm font-semibold text-charcoal transition hover:bg-lavender-dark"
          >
            Start shopping
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}
