import Link from "next/link";
import { FeatureCard } from "@/components/marketing/feature-card";
import { FeatureCarousel } from "@/components/marketing/feature-carousel";
import { HomeCtaSection, HomeHero, HomeIntelligencePanel } from "@/components/marketing/home-sections";
import { ProductShowcaseCard } from "@/components/marketing/product-showcase-card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { StaggerGrid, StaggerItem } from "@/components/motion/primitives";
import { featuredProducts, intelligenceFeatures, trustHighlights } from "@/lib/site-content";
import { featureImages, featuredProductImages } from "@/lib/site-images";

export default function HomePage() {
  return (
    <div className="pb-8">
      <HomeHero />

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <SectionHeading
          eyebrow="Featured catalog"
          title="Build Your Shopping Experience"
          italicWord="Shopping"
          description="explore top categories — footwear, electronics, home & office — curated from our product data."
        />
        <StaggerGrid className="mt-12 grid gap-6 md:grid-cols-3">
          {featuredProducts.map((product) => {
            const image = featuredProductImages[product.sku as keyof typeof featuredProductImages];
            return (
              <StaggerItem key={product.sku}>
                <ProductShowcaseCard
                  {...product}
                  imageSrc={image.src}
                  imageAlt={image.alt}
                />
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading
            align="left"
            eyebrow="NTD Intelligence"
            title="Personalized commerce for every shopper."
            italicWord="Personalized"
            description="search, import, and purchase flows designed for real-world product catalogs — from Camping Tents to Fitness Trackers."
          />
          <HomeIntelligencePanel />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <SectionHeading
          title="Platform capabilities"
          italicWord="capabilities"
          description="everything you need for an enterprise-grade e-commerce demo — no payment provider required."
        />
        <FeatureCarousel>
          {intelligenceFeatures.map((feature) => {
            const image = featureImages[feature.title as keyof typeof featureImages];
            return (
              <FeatureCard
                key={feature.title}
                {...feature}
                imageSrc={image?.src}
                imageAlt={image?.alt}
              />
            );
          })}
        </FeatureCarousel>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <HomeCtaSection />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 md:px-6">
        <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustHighlights.map((item) => (
            <StaggerItem key={item}>
              <div className="rounded-[1.5rem] border border-black/5 bg-white/60 px-5 py-4 text-center text-sm font-medium text-charcoal/80">
                {item}
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
    </div>
  );
}
