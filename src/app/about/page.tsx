import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FadeIn } from "@/components/motion/primitives";
import { ContentImage } from "@/components/ui/content-image";
import { ImageScrim, textOnImageClassName } from "@/components/ui/image-scrim";
import { BRAND_NAME } from "@/lib/site-content";
import { siteImages } from "@/lib/site-images";

export default function AboutPage() {
  return (
    <div className="pb-16">
      <section className="mx-auto max-w-6xl px-4 pt-8 md:px-6">
        <SectionHeading
          align="left"
          eyebrow="About Us"
          title="NTD Commerce becomes your catalog, your consistency"
          italicWord="consistency"
          description="and translates product data into a polished shopping experience — even when your csv has edge cases, duplicate skus, and invalid rows."
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2.5rem] px-8 py-20 text-center md:px-16">
            <Image
              src={siteImages.platformCommerce.src}
              alt={siteImages.platformCommerce.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <ImageScrim variant="banner" />
            <p className={cn("font-mono-body relative z-10 mx-auto max-w-2xl text-sm leading-relaxed text-white", textOnImageClassName())}>
              {BRAND_NAME} is a full-stack e-commerce demo built for the ntd code challenge. we
              showcase enterprise patterns — postgresql persistence, csv import with validation,
              product search, and mock checkout — in a storefront inspired by premium consumer brands.
            </p>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2 md:px-6">
        <FadeIn className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/70">
          <ContentImage
            src={siteImages.missionLifestyle.src}
            alt={siteImages.missionLifestyle.alt}
            className="h-52 w-full"
            rounded="2xl"
          />
          <div className="p-8">
            <h3 className="font-serif-display text-2xl">Our mission</h3>
            <p className="font-mono-body mt-4 text-sm leading-relaxed text-muted">
              we built this storefront to show how messy product data can still become a reliable
              shopping experience — with role-based access, owner approvals, and a catalog that stays
              consistent from csv import through checkout.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1} className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/70">
          <ContentImage
            src={siteImages.catalogVariety.src}
            alt={siteImages.catalogVariety.alt}
            className="h-52 w-full"
            rounded="2xl"
          />
          <div className="p-8">
            <h3 className="font-serif-display text-2xl">What we sell</h3>
            <p className="font-mono-body mt-4 text-sm leading-relaxed text-muted">
              our catalog spans electronics, footwear, home & office, sports, outdoors, beauty,
              kitchen, and more. every product is searchable, manageable, and ready for mock purchase
              through a streamlined cart experience.
            </p>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center md:px-6">
        <FadeIn>
          <Link
            href="/shop"
            className="inline-flex rounded-full bg-lavender px-8 py-3.5 text-sm font-semibold text-charcoal transition hover:bg-lavender-dark"
          >
            Browse the catalog
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
