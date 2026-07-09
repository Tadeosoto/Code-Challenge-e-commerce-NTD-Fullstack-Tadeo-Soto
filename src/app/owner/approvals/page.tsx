"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/marketing/section-heading";
import { formatCurrency } from "@/lib/utils";
import { MAX_STOCK } from "@/lib/validators/product-issues";
import { useAuth } from "@/lib/auth/auth-context";
import { useFeedback } from "@/lib/feedback/feedback-context";

type Product = {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  weightKg: number | null;
  sellerName: string | null;
  sellerUsername: string | null;
  validationIssues?: string[];
};

function getIssues(product: Product): string[] {
  return product.validationIssues ?? [];
}

export default function OwnerApprovalsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useFeedback();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
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
    if (!authLoading && user?.role !== "OWNER") {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.role === "OWNER") {
      loadPending();
    }
  }, [user]);

  async function loadPending() {
    setLoading(true);
    const response = await fetch("/api/products/pending");
    if (response.ok) {
      const data = await response.json();
      setProducts(data.items ?? []);
    }
    setLoading(false);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      weightKg: product.weightKg ? String(product.weightKg) : "",
    });
  }

  async function handleSave(event: FormEvent, productId: string) {
    event.preventDefault();

    const response = await fetch(`/api/products/${productId}`, {
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

    const data = await response.json();
    if (!response.ok) {
      showError(data.error ?? "Update failed");
      return;
    }

    showSuccess(data.message);
    setEditingId(null);
    await loadPending();
  }

  async function handleAction(id: string, action: "approve" | "reject") {
    const response = await fetch(`/api/products/${id}/approval`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await response.json();
    if (!response.ok) {
      showError(data.error ?? "Action failed");
      return;
    }
    showSuccess(data.message);
    setEditingId(null);
    await loadPending();
  }

  if (authLoading || user?.role !== "OWNER") {
    return <p className="font-mono-body text-sm text-muted">Loading owner dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        align="left"
        eyebrow="Owner"
        title="Approve pending products"
        italicWord="pending"
        description="Review imports and seller submissions. Fix validation issues, then approve."
      />

      {loading ? (
        <p className="font-mono-body text-sm text-muted">Loading pending products...</p>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-serif-display text-xl">No products waiting for approval</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {products.map((product) => {
            const issues = getIssues(product);
            const isEditing = editingId === product.id;

            return (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <CardTitle>{product.name}</CardTitle>
                    <Badge>{product.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {issues.length > 0 ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm font-medium text-amber-900">Issues to fix</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {issues.map((issue) => (
                          <Badge key={issue} variant="warning">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                      All validation checks passed. Ready to approve.
                    </div>
                  )}

                  <div className="space-y-1 text-sm">
                    <p>SKU: {product.sku}</p>
                    <p>
                      Price: {formatCurrency(product.price)} · Stock: {product.stock}
                    </p>
                    <p>
                      Source:{" "}
                      {product.sellerName ?? product.sellerUsername ?? "CSV import / catalog"}
                    </p>
                  </div>

                  {isEditing ? (
                    <form
                      className="grid gap-3 rounded-2xl border border-black/5 bg-white p-4 md:grid-cols-2"
                      onSubmit={(e) => handleSave(e, product.id)}
                    >
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
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="Price (must be greater than 0)"
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
                      <Input
                        type="number"
                        step="0.001"
                        min="0"
                        value={form.weightKg}
                        onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                        placeholder="Weight (kg)"
                      />
                      <Textarea
                        className="md:col-span-2"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Description"
                      />
                      <div className="flex gap-2 md:col-span-2">
                        <Button type="submit" variant="accent">
                          Save changes
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={() => startEdit(product)}>
                        Edit product
                      </Button>
                      <Button
                        variant="accent"
                        onClick={() => handleAction(product.id, "approve")}
                        disabled={issues.length > 0}
                      >
                        Approve
                      </Button>
                      <Button variant="destructive" onClick={() => handleAction(product.id, "reject")}>
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
