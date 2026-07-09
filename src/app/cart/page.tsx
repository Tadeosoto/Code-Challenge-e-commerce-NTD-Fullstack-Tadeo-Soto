"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cart/cart-context";
import { useAuth } from "@/lib/auth/auth-context";
import { useFeedback } from "@/lib/feedback/feedback-context";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useFeedback();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (!user || user.role !== "BUYER") {
      showError("Please log in as a buyer to complete checkout.", "Login required");
      router.push("/login");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    });

    setLoading(false);
    const data = await response.json();

    if (!response.ok) {
      showError(data.error ?? "Checkout failed");
      return;
    }

    showSuccess(data.message ?? "Mock payment successful — your order is confirmed.");
    clearCart();
    router.push(`/orders/${data.id}`);
  }

  function handleRemove(productId: string, name: string) {
    removeItem(productId);
    showSuccess(`${name} was removed from your cart.`);
  }

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <SectionHeading
          align="left"
          title="Your cart is empty"
          italicWord="empty"
          description="browse running shoes, bluetooth speakers, standing desks, and more."
        />
        <Link
          href="/shop"
          className="inline-flex rounded-full bg-lavender px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-lavender-dark"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeading align="left" title="Shopping cart" italicWord="cart" />

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col gap-3 border-b border-black/5 pb-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-serif-display text-lg">{item.name}</p>
                <p className="font-mono-body text-sm text-muted">SKU: {item.sku}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={item.stock}
                  value={item.quantity}
                  onChange={(event) =>
                    updateQuantity(item.productId, Number(event.target.value))
                  }
                  className="h-10 w-20 rounded-full border border-black/10 bg-cream px-3 text-sm"
                />
                <span className="min-w-24 text-right font-semibold">
                  {formatCurrency(item.price * item.quantity)}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleRemove(item.productId, item.name)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono-body text-sm text-muted">Subtotal</p>
            <p className="font-serif-display text-3xl">{formatCurrency(subtotal)}</p>
          </div>
          <Button variant="accent" onClick={handleCheckout} disabled={loading}>
            {loading ? "Processing payment..." : "Complete mock payment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
