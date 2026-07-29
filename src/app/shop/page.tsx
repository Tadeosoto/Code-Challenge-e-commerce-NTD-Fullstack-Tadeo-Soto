"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FadeIn } from "@/components/motion/primitives";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cart/cart-context";
import { useAuth } from "@/lib/auth/auth-context";
import { useFeedback } from "@/lib/feedback/feedback-context";
import { getProductCategoryImage } from "@/lib/product-images";
import { siteImages } from "@/lib/site-images";
import { ImageScrim } from "@/components/ui/image-scrim";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  OwnerProductEditModal,
  type ShopProduct,
} from "@/components/products/owner-product-edit-modal";
import type { ProductSort } from "@/lib/validators/product";

type Product = ShopProduct;

type SearchResponse = {
  items: Product[];
  categories: string[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const SORT_OPTIONS: Array<{ value: ProductSort; label: string }> = [
  { value: "name-asc", label: "Name A → Z" },
  { value: "name-desc", label: "Name Z → A" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "date-asc", label: "Oldest first" },
  { value: "date-desc", label: "Newest first" },
];

const selectClassName =
  "h-10 w-full rounded-full border border-black/10 bg-cream px-4 text-sm outline-none";

export default function ShopPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useFeedback();
  const { addItem, removeItem, items } = useCart();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<ProductSort | "">("");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const isOwner = user?.role === "OWNER";

  function reloadProducts() {
    setReloadKey((value) => value + 1);
  }

  function handleAddToCart(product: Product) {
    if (!user || user.role !== "BUYER") {
      showError("Please log in as a buyer to add items to your cart.", "Login required");
      router.push("/login");
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
    });
    showSuccess(`${product.name} was added to your cart.`);
  }

  function handleRemoveFromCart(product: Product) {
    removeItem(product.id);
    showSuccess(`${product.name} was removed from your cart.`);
  }

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category) params.set("category", category);
      params.set("sort", sort || "name-asc");
      params.set("page", String(page));
      try {
        const response = await fetch(`/api/products/search?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as SearchResponse;
        if (!controller.signal.aborted) {
          setResults(data);
          setLoading(false);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [query, category, sort, page, reloadKey]);

  async function handleConfirmDelete() {
    if (!deletingProduct) return;
    setDeleting(true);

    const response = await fetch(`/api/products/${deletingProduct.id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    setDeleting(false);

    if (!response.ok) {
      showError(data.error ?? "Delete failed");
      return;
    }

    if (items.some((item) => item.productId === deletingProduct.id)) {
      removeItem(deletingProduct.id);
    }

    showSuccess(data.message);
    setDeletingProduct(null);
    reloadProducts();
  }

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateCategory(value: string) {
    setCategory(value);
    setPage(1);
  }

  function updateSort(value: ProductSort) {
    setSort(value);
    setPage(1);
  }

  const total = results?.total ?? 0;
  const totalPages = results?.totalPages ?? 1;
  const currentPage = results?.page ?? page;
  const limit = results?.limit ?? 12;
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(currentPage * limit, total);

  function goToPage(nextPage: number) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2.5rem]">
        <div className="relative min-h-56 md:min-h-72">
          <Image
            src={siteImages.shopCollection.src}
            alt={siteImages.shopCollection.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0">
            <ImageScrim variant="banner" />
          </div>
          <div className="relative z-10 flex h-full min-h-56 items-end p-6 md:min-h-72 md:p-10">
            <SectionHeading
              align="left"
              eyebrow="Catalog"
              title="Shop the collection"
              italicWord="collection"
              description="search by name, sku, category, or description. add items to cart and complete mock payment at checkout."
              animated={false}
              className="text-on-image [&_h2]:text-white [&_p]:text-white [&_span]:bg-white/25"
            />
          </div>
        </div>
      </div>

      <FadeIn className="rounded-4xl border border-black/5 bg-white/70 p-6">
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
          <Input
            placeholder="Search Running Shoes, Bluetooth Speaker, Yoga Mat..."
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            className="rounded-full border-black/10 bg-cream"
          />
          <select
            className={selectClassName}
            value={category}
            onChange={(event) => updateCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {results?.categories.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          <select
            className={selectClassName}
            value={sort}
            onChange={(event) => updateSort(event.target.value as ProductSort)}
            aria-label="Sort products"
          >
            <option value="">Sort by</option>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FadeIn>

      <div className="min-h-[40rem] space-y-6 md:min-h-[48rem]">
        {loading && !results ? (
          <>
            <p className="font-mono-body text-sm text-muted">Loading products...</p>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-hidden>
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="overflow-hidden rounded-4xl border border-black/5 bg-white/70"
                >
                  <div className="min-h-44 animate-pulse bg-charcoal/10" />
                  <div className="space-y-3 p-6">
                    <div className="h-7 w-3/4 animate-pulse rounded bg-charcoal/10" />
                    <div className="h-4 w-full animate-pulse rounded bg-charcoal/10" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-charcoal/10" />
                    <div className="mt-4 h-8 w-28 animate-pulse rounded-full bg-charcoal/10" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {total > 0 ? (
              <p className="font-mono-body text-sm text-muted">
                {loading ? "Updating results..." : `Showing ${rangeStart}–${rangeEnd} of ${total} products`}
              </p>
            ) : null}

            {results && results.items.length > 0 ? (
              <div
                className={`grid gap-6 md:grid-cols-2 xl:grid-cols-3 ${loading ? "opacity-70 transition-opacity" : ""}`}
              >
                {results.items.map((product) => {
                  const inCart = items.some((item) => item.productId === product.id);
                  const image = getProductCategoryImage(product.category, product.name, product.sku);
                  return (
                    <div key={product.id}>
                      <article className="flex h-full flex-col overflow-hidden rounded-4xl border border-black/5 bg-white/70">
                        <div className="relative min-h-44">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                          <ImageScrim variant="card" />
                          <div className="absolute bottom-4 left-4 z-10">
                            <Badge className="bg-white/90 text-charcoal">{product.category}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-6">
                          <h3 className="font-serif-display text-2xl">{product.name}</h3>
                          <p className="font-mono-body line-clamp-2 text-sm text-muted">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold">{formatCurrency(product.price)}</span>
                            <span className="text-muted">SKU: {product.sku}</span>
                          </div>
                          <div className="mt-auto flex flex-col gap-3 pt-2">
                            <div className="flex items-center justify-between gap-2">
                              <Badge variant={product.stock > 0 ? "success" : "danger"}>
                                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                              </Badge>
                              <div className="flex gap-2">
                                {inCart ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveFromCart(product)}
                                  >
                                    Remove
                                  </Button>
                                ) : null}
                                <Button
                                  variant="accent"
                                  size="sm"
                                  disabled={product.stock === 0}
                                  onClick={() => handleAddToCart(product)}
                                >
                                  Add to cart
                                </Button>
                              </div>
                            </div>
                            {isOwner ? (
                              <div className="flex gap-2 border-t border-black/5 pt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => setEditingProduct(product)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => setDeletingProduct(product)}
                                >
                                  Delete
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {results && results.items.length === 0 && !loading ? (
              <div className="rounded-4xl border border-black/5 bg-white/60 p-10 text-center">
                <p className="font-serif-display text-2xl">No products found</p>
                <p className="font-mono-body mt-2 text-sm text-muted">
                  try importing the catalog from the owner import page first.
                </p>
                <Link
                  href="/owner/import"
                  className="mt-4 inline-flex rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Owner: import catalog
                </Link>
              </div>
            ) : null}

            {totalPages > 1 ? (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-4xl border border-black/5 bg-white/70 px-6 py-4">
                <p className="font-mono-body text-sm text-muted">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1 || loading}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? "accent" : "outline"}
                      size="sm"
                      disabled={loading}
                      onClick={() => goToPage(pageNumber)}
                      className="min-w-10"
                    >
                      {pageNumber}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages || loading}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>

      <OwnerProductEditModal
        product={editingProduct}
        open={editingProduct !== null}
        onClose={() => setEditingProduct(null)}
        onSaved={(message) => {
          showSuccess(message);
          reloadProducts();
        }}
        onError={showError}
      />

      <ConfirmDialog
        open={deletingProduct !== null}
        title="Delete product?"
        message={
          deletingProduct
            ? `Are you sure you want to delete "${deletingProduct.name}" (SKU: ${deletingProduct.sku})? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete product"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!deleting) setDeletingProduct(null);
        }}
      />
    </div>
  );
}
