"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, Minimize2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";
import { useCart } from "@/lib/cart/cart-context";
import { useFeedback } from "@/lib/feedback/feedback-context";
import { formatCurrency } from "@/lib/utils";

type ChatRole = "user" | "assistant";

type SuggestedProduct = {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
};

type UiMessage = {
  id: string;
  role: ChatRole;
  content: string;
  products?: SuggestedProduct[];
};

const HIDDEN_CHAT_PREFIXES = ["/login", "/owner", "/seller", "/admin"];

const WELCOME_MESSAGE: UiMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! Ask me about approved products — prices, stock, or ideas like “running shoes” or “bluetooth speaker”.",
};

function shouldShowChat(pathname: string) {
  return !HIDDEN_CHAT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function ShoppingAssistant() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { showSuccess, showError } = useFeedback();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([WELCOME_MESSAGE]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const visible = shouldShowChat(pathname);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  if (!visible) return null;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddToCart = (product: SuggestedProduct) => {
    if (!user || user.role !== "BUYER") {
      showError("Please log in as a buyer to add items to your cart.", "Login required");
      router.push("/login");
      return;
    }

    if (product.stock <= 0) {
      showError("That product is out of stock.");
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
  };

  const handleViewShop = () => {
    router.push("/shop");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || loading) return;

    const userMessage: UiMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const payload = nextMessages
        .filter((message) => message.id !== "welcome")
        .slice(-10)
        .map((message) => ({ role: message.role, content: message.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });
      const data = (await response.json()) as {
        reply?: string;
        products?: SuggestedProduct[];
        error?: string;
      };

      if (!response.ok) {
        setMessages((current) => [
          ...current,
          {
            id: `assistant-error-${Date.now()}`,
            role: "assistant",
            content: data.error ?? "Sorry, the shopping assistant is unavailable right now.",
          },
        ]);
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.reply ?? "Here is what I found in the approved catalog.",
          products: data.products ?? [],
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I could not reach the shopping assistant. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      {open ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Shopping assistant"
          className="pointer-events-auto flex h-[min(32rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-4xl border border-black/10 bg-cream shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-black/5 bg-white/90 px-4 py-3">
            <div>
              <p className="font-serif-display text-lg text-charcoal">Shopping assistant</p>
              <p className="font-mono-body text-xs text-muted">Stays open while you browse</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-charcoal/5"
                aria-label="Minimize chat"
              >
                <Minimize2 className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-charcoal/5"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-charcoal text-white"
                      : "border border-black/5 bg-white text-charcoal"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.products && message.products.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {message.products.map((product) => (
                        <div
                          key={product.id}
                          className="rounded-2xl border border-black/5 bg-cream/80 p-3"
                        >
                          <p className="font-medium">{product.name}</p>
                          <p className="font-mono-body mt-1 text-xs text-muted">
                            {product.sku} · {formatCurrency(product.price)} ·{" "}
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="accent"
                              disabled={product.stock <= 0}
                              onClick={() => handleAddToCart(product)}
                            >
                              Add to cart
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={handleViewShop}
                            >
                              View shop
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {loading ? (
              <p className="font-mono-body text-xs text-muted">Assistant is thinking...</p>
            ) : null}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-black/5 bg-white/90 p-3"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about products, prices, stock..."
              disabled={loading}
              className="bg-cream"
              aria-label="Chat message"
            />
            <Button
              type="submit"
              variant="accent"
              size="sm"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="shrink-0"
            >
              <Send className="h-4 w-4" aria-hidden />
            </Button>
          </form>
        </div>
      ) : null}

      {!open ? (
        <button
          type="button"
          onClick={handleOpen}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-charcoal/90"
          aria-label="Open shopping assistant chat"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Chat
        </button>
      ) : null}
    </div>
  );
}
