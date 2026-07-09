import { z } from "zod";
import { MAX_STOCK } from "@/lib/validators/product-issues";

export const productInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(500),
  sku: z.string().trim().min(1, "SKU is required").max(100),
  description: z.string().max(5000).optional().default(""),
  category: z.string().trim().min(1, "Category is required").max(100),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .positive("Stock must be greater than 0")
    .max(MAX_STOCK, `Stock cannot exceed ${MAX_STOCK.toLocaleString()}`),
  weightKg: z.coerce.number().nonnegative().optional().nullable(),
});

export const productUpdateSchema = productInputSchema.partial();

export const productSortSchema = z.enum([
  "name-asc",
  "name-desc",
  "price-asc",
  "price-desc",
  "date-asc",
  "date-desc",
]);

export const searchQuerySchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  sort: productSortSchema.optional().default("name-asc"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(12),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
});

export const checkoutSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Cart must contain at least one item"),
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type ProductSort = z.infer<typeof productSortSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
