import { NextRequest } from "next/server";
import { searchProducts, listCategories } from "@/lib/services/product.service";
import { searchQuerySchema } from "@/lib/validators/product";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = searchQuerySchema.safeParse(params);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const [results, categories] = await Promise.all([
    searchProducts(parsed.data),
    listCategories(),
  ]);

  return Response.json({ ...results, categories });
}
