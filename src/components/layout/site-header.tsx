"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, LogOut } from "lucide-react";
import { BRAND_SHORT } from "@/lib/site-content";
import { useAuth } from "@/lib/auth/auth-context";
import { LoginReminderBubble } from "@/components/auth/login-reminder-bubble";
import { useCart } from "@/lib/cart/cart-context";
import { useFeedback } from "@/lib/feedback/feedback-context";
import {
  getMobileRoleLinks,
  MobileNavMenu,
  mobilePublicLinks,
} from "@/components/layout/mobile-nav-menu";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { showSuccess } = useFeedback();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  async function handleLogout() {
    await logout();
    showSuccess("You have been logged out.");
    router.push("/");
    setMobileOpen(false);
  }

  const roleLinks = getMobileRoleLinks(user);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-lavender px-4 py-2 text-center text-sm font-medium text-charcoal">
        Free shipping on orders over $30 · Log in to shop, sell, or approve products
      </div>

      <div className="px-4 pt-4 pb-2">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full bg-charcoal/95 px-4 py-3 text-white shadow-lg backdrop-blur-md md:px-6">
          <Link href="/" className="shrink-0 text-lg font-bold tracking-[0.15em] uppercase">
            {BRAND_SHORT}
          </Link>

          <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
            {mobilePublicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition hover:text-lavender",
                  pathname === link.href && "text-lavender",
                )}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "SELLER" ? (
              <Link href="/seller/products" className="hover:text-lavender">
                My Products
              </Link>
            ) : null}
            {user?.role === "OWNER" ? (
              <>
                <Link href="/owner/approvals" className="hover:text-lavender">
                  Approvals
                </Link>
                <Link href="/owner/import" className="hover:text-lavender">
                  Import CSV
                </Link>
              </>
            ) : null}
          </nav>

          <div className="flex items-center gap-1 md:gap-3">
            {user ? (
              <span className="hidden text-xs text-white/70 lg:inline">
                {user.role === "SELLER" ? user.sellerName ?? user.username : user.username} ({user.role})
              </span>
            ) : null}
            <Link
              href="/shop"
              aria-label="Search products"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10"
            >
              <Search className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/cart"
              aria-label={
                itemCount > 0 ? `Shopping cart, ${itemCount} items` : "Shopping cart"
              }
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              {itemCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-lavender px-1 text-[10px] font-bold text-charcoal">
                  {itemCount}
                </span>
              ) : null}
            </Link>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" aria-hidden />
              </button>
            ) : (
              <LoginReminderBubble />
            )}
            <MobileNavMenu
              isOpen={mobileOpen}
              onToggle={() => setMobileOpen((open) => !open)}
              onClose={() => setMobileOpen(false)}
              pathname={pathname}
              publicLinks={mobilePublicLinks}
              roleLinks={roleLinks}
              user={user}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
