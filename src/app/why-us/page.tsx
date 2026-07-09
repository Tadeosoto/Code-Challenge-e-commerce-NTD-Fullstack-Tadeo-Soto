import Link from "next/link";
import Image from "next/image";
import { FeatureCard } from "@/components/marketing/feature-card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FadeIn } from "@/components/motion/primitives";
import { ImageScrim } from "@/components/ui/image-scrim";
import { intelligenceFeatures } from "@/lib/site-content";
import { featureImages, siteImages } from "@/lib/site-images";

export default function WhyUsPage() {
  return (
    <div className="pb-16">
      <section className="mx-auto max-w-6xl px-4 pt-8 md:px-6">
        <SectionHeading
          eyebrow="Why Us"
          title="Every product is an Individual"
          italicWord="Individual"
          description="from fitness trackers to scented candles — each item in our catalog is validated, searchable, and ready for a seamless checkout experience."
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <FadeIn>
            <div className="relative min-h-[24rem] overflow-hidden rounded-[2.5rem]">
              <Image
                src={siteImages.dataAnalytics.src}
                alt={siteImages.dataAnalytics.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <ImageScrim variant="banner" />
              <div className="absolute inset-x-6 bottom-6 z-10 md:inset-x-10 md:bottom-10">
                <div className="rounded-[1.5rem] border border-white/30 bg-white/95 p-6 text-charcoal shadow-xl backdrop-blur-md">
                  <p className="font-serif-display text-xl text-charcoal">My Catalog</p>
                  <ul className="mt-4 space-y-3 font-mono-body text-sm">
                    <li className="flex items-center justify-between gap-4 border-b border-charcoal/10 pb-2">
                      <span className="font-medium text-charcoal">Running Shoes · RS-001</span>
                      <span className="shrink-0 rounded-full bg-charcoal/8 px-2.5 py-0.5 text-xs font-semibold text-charcoal">
                        Footwear
                      </span>
                    </li>
                    <li className="flex items-center justify-between gap-4 border-b border-charcoal/10 pb-2">
                      <span className="font-medium text-charcoal">Bluetooth Speaker · BS-021</span>
                      <span className="shrink-0 rounded-full bg-charcoal/8 px-2.5 py-0.5 text-xs font-semibold text-charcoal">
                        Electronics
                      </span>
                    </li>
                    <li className="flex items-center justify-between gap-4 pb-2">
                      <span className="font-medium text-charcoal">Standing Desk · SD-004</span>
                      <span className="shrink-0 rounded-full bg-charcoal/8 px-2.5 py-0.5 text-xs font-semibold text-charcoal">
                        Home & Office
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="space-y-6">
            <h3 className="font-serif-display text-3xl">
              Built for <em className="italic">real-world</em> data
            </h3>
            <p className="font-mono-body text-sm leading-relaxed text-muted">
              our platform handles malformed csv rows, duplicate skus, and invalid prices without
              crashing. owners import once, review quarantined items, and shoppers browse approved
              products with confidence.
            </p>
            <p className="font-mono-body text-sm leading-relaxed text-muted">
              transactional checkout decrements stock atomically. out-of-stock items like vintage
              clocks remain visible in search but cannot be purchased — exactly as enterprise
              systems should behave.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {intelligenceFeatures.map((feature, index) => {
            const image = featureImages[feature.title as keyof typeof featureImages];
            return (
              <FadeIn key={feature.title} delay={index * 0.05}>
                <FeatureCard
                  {...feature}
                  imageSrc={image?.src}
                  imageAlt={image?.alt}
                />
              </FadeIn>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 text-center md:px-6">
        <FadeIn>
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-charcoal px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-charcoal/90"
          >
            Get in touch
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
