"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MAX_STOCK } from "@/lib/validators/product-issues";

export type ShopProduct = {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  weightKg?: number | null;
};

type OwnerProductEditModalProps = {
  product: ShopProduct | null;
  open: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
  onError: (message: string) => void;
};

export function OwnerProductEditModal({
  product,
  open,
  onClose,
  onSaved,
  onError,
}: OwnerProductEditModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    weightKg: "",
  });

  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      weightKg: product.weightKg != null ? String(product.weightKg) : "",
    });
  }, [product]);

  if (!open || !product) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);

    const response = await fetch(`/api/products/${product!.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        sku: form.sku,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        weightKg: form.weightKg ? Number(form.weightKg) : null,
      }),
    });

    setSubmitting(false);
    const data = await response.json();

    if (!response.ok) {
      onError(data.error ?? "Update failed");
      return;
    }

    onSaved(data.message ?? "Product updated successfully.");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
        disabled={submitting}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-product-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-4xl border border-black/5 bg-cream p-6 shadow-xl md:p-8"
      >
        <h2 id="edit-product-title" className="font-serif-display text-2xl">
          Edit product
        </h2>
        <p className="font-mono-body mt-1 text-sm text-muted">
          Update catalog details for {product.name}.
        </p>

        <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            required
          />
          <Input
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            placeholder="SKU"
            required
          />
          <Input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Category"
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Price"
              required
            />
            <Input
              type="number"
              min="1"
              max={MAX_STOCK}
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder={`Stock (1-${MAX_STOCK.toLocaleString()})`}
              required
            />
          </div>
          <Input
            type="number"
            step="0.001"
            min="0"
            value={form.weightKg}
            onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
            placeholder="Weight (kg, optional)"
          />
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
          />
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={submitting}>
              {submitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
