import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { UserRole } from "@/generated/prisma/client";

export type SessionPayload = {
  userId: string;
  username: string;
  role: UserRole;
  sellerName: string | null;
};

const SESSION_COOKIE = "ntd_session";

function getSecret() {
  const secret = process.env.SESSION_SECRET ?? "dev-session-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.userId !== "string" ||
      typeof payload.username !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }
    return {
      userId: payload.userId,
      username: payload.username,
      role: payload.role as UserRole,
      sellerName: typeof payload.sellerName === "string" ? payload.sellerName : null,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getSessionFromRequest(
  request: NextRequest,
): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function sessionCookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    name: SESSION_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function unauthorizedResponse(message = "Unauthorized") {
  return Response.json({ error: message }, { status: 401 });
}

export function forbiddenResponse(message = "Forbidden") {
  return Response.json({ error: message }, { status: 403 });
}

export function requireRole(session: SessionPayload | null, roles: UserRole[]) {
  return Boolean(session && roles.includes(session.role));
}
