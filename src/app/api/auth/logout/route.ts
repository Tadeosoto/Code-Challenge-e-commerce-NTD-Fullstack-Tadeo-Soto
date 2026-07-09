import { NextResponse } from "next/server";
import { sessionCookieOptions } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });
  response.cookies.set(sessionCookieOptions().name, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
