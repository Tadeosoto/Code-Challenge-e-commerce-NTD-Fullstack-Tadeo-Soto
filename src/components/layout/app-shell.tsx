"use client";

import { usePathname } from "next/navigation";
import { RolePickerModal } from "@/components/auth/role-picker-modal";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartProvider } from "@/lib/cart/cart-context";
import { AuthProvider } from "@/lib/auth/auth-context";
import { FeedbackProvider } from "@/lib/feedback/feedback-context";
import { cn } from "@/lib/utils";

function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketing =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/why-us" ||
    pathname === "/contact";

  return (
    <main
      className={cn(
        "flex-1",
        isMarketing ? "w-full" : "mx-auto w-full max-w-6xl px-4 py-8",
      )}
    >
      {children}
    </main>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FeedbackProvider>
        <CartProvider>
          <RolePickerModal />
          <SiteHeader />
          <MainContent>{children}</MainContent>
          <SiteFooter />
        </CartProvider>
      </FeedbackProvider>
    </AuthProvider>
  );
}
