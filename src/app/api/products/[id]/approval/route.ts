import { NextRequest } from "next/server";
import {
  approveProduct,
  rejectProduct,
} from "@/lib/services/product.service";
import {
  getSessionFromRequest,
  requireRole,
  unauthorizedResponse,
} from "@/lib/session";
import { UserRole } from "@/generated/prisma/client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);
  if (!requireRole(session, [UserRole.OWNER])) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;
  const body = await request.json();
  const action = body.action as "approve" | "reject";

  if (action === "approve") {
    try {
      const product = await approveProduct(id);
      return Response.json({
        message: `Product "${product.name}" approved and is now live in the shop.`,
        product,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Approval failed";
      return Response.json({ error: message }, { status: 409 });
    }
  }

  if (action === "reject") {
    const product = await rejectProduct(id);
    return Response.json({
      message: `Product "${product.name}" rejected and will not appear in the shop.`,
      product,
    });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}
