import { describe, expect, it } from "vitest";
import { productInputSchema, checkoutSchema } from "@/lib/validators/product";

describe("product validators", () => {
  it("validates product input", () => {
    const parsed = productInputSchema.safeParse({
      name: "Test Product",
      sku: "TP-001",
      description: "Desc",
      category: "Misc",
      price: 10,
      stock: 5,
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects negative stock", () => {
    const parsed = productInputSchema.safeParse({
      name: "Test Product",
      sku: "TP-001",
      category: "Misc",
      price: 10,
      stock: -1,
    });

    expect(parsed.success).toBe(false);
  });

  it("validates checkout payload", () => {
    const parsed = checkoutSchema.safeParse({
      items: [{ productId: "abc", quantity: 2 }],
    });

    expect(parsed.success).toBe(true);
  });
});
