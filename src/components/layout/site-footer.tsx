import Link from "next/link";
import { FooterNewsletter } from "@/components/layout/footer-newsletter";
import { BRAND_NAME, BRAND_SHORT } from "@/lib/site-content";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-charcoal text-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <FooterNewsletter />

        <div className="my-12 border-t border-white/10" />

        <div className="grid gap-10 md:grid-cols-[1fr_2fr_1fr]">
          <div>
            <p className="text-2xl font-bold tracking-[0.12em] uppercase">{BRAND_SHORT}</p>
            <p className="mt-2 text-xs text-white/60">{BRAND_NAME}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <ul className="space-y-3 font-serif-display text-sm">
              <li>
                <Link href="/" className="hover:text-lavender">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-lavender">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="hover:text-lavender">
                  Why Us
                </Link>
              </li>
            </ul>
            <ul className="space-y-3 font-serif-display text-sm">
              <li>
                <Link href="/about" className="hover:text-lavender">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-lavender">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/owner/import" className="hover:text-lavender">
                  Owner Import
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm text-white/70">
              Follow our journey building enterprise-grade commerce — from Running Shoes to Standing
              Desks.
            </p>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-white/60">
          ©2026 {BRAND_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
