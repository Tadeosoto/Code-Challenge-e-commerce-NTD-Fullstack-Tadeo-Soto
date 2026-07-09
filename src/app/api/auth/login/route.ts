import { NextResponse } from "next/server";
import { loginAsRole } from "@/lib/services/auth.service";
import { roleLoginSchema } from "@/lib/validators/auth";
import { createSessionToken, sessionCookieOptions } from "@/lib/session";
import { UserRole } from "@/generated/prisma/client";

const roleMessages: Record<UserRole, string> = {
  BUYER: "Logged in as Buyer. You can shop, manage your cart, and checkout.",
  SELLER: "Logged in as Seller. Add products — they will wait for owner approval.",
  OWNER: "Logged in as Owner. Approve products and import the catalog.",
};

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = roleLoginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid role" }, { status: 400 });
  }

  const user = await loginAsRole(parsed.data.role as UserRole);

  const token = await createSessionToken({
    userId: user.id,
    username: user.username,
    role: user.role,
    sellerName: user.sellerName,
  });

  const message =
    user.role === UserRole.SELLER
      ? `Logged in as ${user.sellerName ?? "Seller"}. Add products — they will wait for owner approval.`
      : roleMessages[user.role];

  const response = NextResponse.json({
    message,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      sellerName: user.sellerName,
    },
  });

  response.cookies.set(sessionCookieOptions().name, token, sessionCookieOptions());
  return response;
}
