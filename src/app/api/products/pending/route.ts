import { NextRequest } from "next/server";
import {
  getSessionFromRequest,
  requireRole,
  unauthorizedResponse,
} from "@/lib/session";
import { listPendingProducts } from "@/lib/services/product.service";
import { UserRole } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!requireRole(session, [UserRole.OWNER])) {
    return unauthorizedResponse();
  }

  const products = await listPendingProducts();
  return Response.json({ items: products });
}
