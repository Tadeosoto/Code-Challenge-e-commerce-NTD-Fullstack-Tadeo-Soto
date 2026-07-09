import { NextRequest } from "next/server";
import { checkout, CheckoutError, getOrderById } from "@/lib/services/order.service";
import { checkoutSchema } from "@/lib/validators/product";
import {
  forbiddenResponse,
  getSessionFromRequest,
  requireRole,
} from "@/lib/session";
import { UserRole } from "@/generated/prisma/client";

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!requireRole(session, [UserRole.BUYER])) {
    return forbiddenResponse("Only buyers can complete checkout. Please log in as a buyer.");
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const order = await checkout(parsed.data, session!.userId);
    return Response.json(
      {
        message: "Mock payment successful — your order is confirmed.",
        ...order,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof CheckoutError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    return Response.json({ error: "Checkout failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return Response.json({ error: "Order id is required" }, { status: 400 });
  }

  const order = await getOrderById(id);
  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  return Response.json(order);
}
