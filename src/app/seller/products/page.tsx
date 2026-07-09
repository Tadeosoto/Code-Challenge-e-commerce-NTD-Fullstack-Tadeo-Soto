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
  status: string;
};

const emptyForm = {
  name: "",
  sku: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  weightKg: "",
};

export default function SellerProductsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useFeedback();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.role !== "SELLER") {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.role === "SELLER") {
      loadProducts();
    }
  }, [user]);

  async function loadProducts() {
    const response = await fetch("/api/products?scope=mine");
    if (!response.ok) return;
    const data = await response.json();
    setProducts(data.items ?? []);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      sku: form.sku,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      weightKg: form.weightKg ? Number(form.weightKg) : null,
    };

    const response = await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    const data = await response.json();

    if (!response.ok) {
      showError(data.error ?? "Request failed");
      return;
    }

    showSuccess(data.message);
    setForm(emptyForm);
    setEditingId(null);
    await loadProducts();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      showError(data.error ?? "Delete failed");
      return;
    }
    showSuccess(data.message);
    await loadProducts();
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

  if (authLoading || user?.role !== "SELLER") {
    return <p className="font-mono-body text-sm text-muted">Loading seller dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        align="left"
        eyebrow={user.sellerName ?? "Seller"}
        title="Manage your products"
        italicWord="products"
        description="create and edit your listings. every change requires owner approval before appearing in the shop."
      />

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Product" : "Create Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            <Input placeholder="Price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input placeholder="Stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            <Input placeholder="Weight (kg)" type="number" step="0.001" min="0" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} />
            <Textarea className="md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex gap-2 md:col-span-2">
              <Button type="submit" variant="accent" disabled={loading}>
                {editingId ? "Update" : "Create"}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-muted">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">SKU</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-black/5">
                  <td className="py-3 pr-4 font-medium">{product.name}</td>
                  <td className="py-3 pr-4">{product.sku}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={product.status === "APPROVED" ? "success" : product.status === "REJECTED" ? "danger" : "warning"}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">{formatCurrency(product.price)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(product)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id, product.name)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
