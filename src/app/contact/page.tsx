"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FadeIn } from "@/components/motion/primitives";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageScrim, textOnImageClassName } from "@/components/ui/image-scrim";
import { siteImages } from "@/lib/site-images";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="pb-16">
      <section className="mx-auto max-w-6xl px-4 pt-8 md:px-6">
        <SectionHeading
          align="left"
          eyebrow="Contact"
          title="Submit a support request"
          italicWord="support"
          description="questions about products, orders, or csv import? send us a message — this is a demo form with dummy submission."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <FadeIn className="rounded-[2rem] border border-black/5 bg-white/70 p-6 md:p-10">
            {submitted ? (
              <div className="py-12 text-center">
                <p className="font-serif-display text-2xl">Thank you for reaching out</p>
                <p className="font-mono-body mt-3 text-sm text-muted">
                  your message has been received. in this demo, submissions are not sent anywhere —
                  but in a production app we would route order, product, and csv import requests to
                  the right team within 1–2 business days.
                </p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Issue type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="h-11 w-full rounded-2xl border border-black/10 bg-cream px-4 text-sm outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Please choose your issue below
                    </option>
                    <option value="order">Order & checkout</option>
                    <option value="product">Product inquiry</option>
                    <option value="import">CSV import help</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Your name <span className="text-red-500">*</span>
                    </label>
                    <Input required placeholder="Tadeo Soto" className="rounded-2xl bg-cream" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="you@example.com"
                      className="rounded-2xl bg-cream"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Order or SKU reference</label>
                  <Input placeholder="RS-001, WE-023..." className="rounded-2xl bg-cream" />
                  <p className="mt-1 text-xs text-muted">
                    optional — include a product sku like Bluetooth Speaker (BS-021) if relevant
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    required
                    placeholder="Tell us how we can help..."
                    className="min-h-36 rounded-2xl bg-cream"
                  />
                </div>

                <Button type="submit" variant="default" className="w-full rounded-full py-3">
                  Submit
                </Button>
              </form>
            )}
          </FadeIn>

          <FadeIn delay={0.1} className="relative min-h-[28rem] overflow-hidden rounded-[2rem]">
            <Image
              src={siteImages.contactSupport.src}
              alt={siteImages.contactSupport.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <ImageScrim variant="panel" />
            <div className={cn("absolute inset-x-0 bottom-0 z-10 p-8 text-white", textOnImageClassName())}>
              <p className="font-serif-display text-2xl">We are here to help</p>
              <p className="font-mono-body mt-3 text-sm text-white">
                order questions, csv import issues, or product availability — our demo support flow
                is ready for your message.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
