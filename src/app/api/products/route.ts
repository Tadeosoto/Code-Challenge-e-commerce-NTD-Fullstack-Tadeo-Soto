import { NextRequest } from "next/server";
import {
  createProduct,
  listProducts,
} from "@/lib/services/product.service";
import { productInputSchema } from "@/lib/validators/product";
import {
  forbiddenResponse,
  getSessionFromRequest,
  requireRole,
  unauthorizedResponse,
} from "@/lib/session";
import { UserRole } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "100");
  const scope = request.nextUrl.searchParams.get("scope");

  if (scope === "mine") {
    if (!requireRole(session, [UserRole.SELLER])) {
      return unauthorizedResponse();
    }
    const data = await listProducts(page, limit, session!.userId);
    return Response.json(data);
  }

  if (!requireRole(session, [UserRole.OWNER])) {
    return unauthorizedResponse();
  }

  const data = await listProducts(page, limit);
  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!requireRole(session, [UserRole.SELLER])) {
    return forbiddenResponse("Only sellers can create products");
  }

  const body = await request.json();
  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const product = await createProduct(parsed.data, session!.userId);
    return Response.json(
      {
        message: "Product created successfully — waiting for owner approval.",
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return Response.json({ error: message }, { status: 400 });
  }
}
