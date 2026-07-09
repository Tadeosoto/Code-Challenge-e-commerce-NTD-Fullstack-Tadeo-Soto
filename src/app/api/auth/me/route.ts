import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ user: null });
  }

  return Response.json({
    user: {
      id: session.userId,
      username: session.username,
      role: session.role,
      sellerName: session.sellerName,
    },
  });
}
