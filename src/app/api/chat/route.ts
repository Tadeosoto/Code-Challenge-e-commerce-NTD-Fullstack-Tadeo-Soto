import { runShoppingChat } from "@/lib/services/chat.service";
import { chatRequestSchema } from "@/lib/validators/chat";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await runShoppingChat(parsed.data.messages);
    return Response.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === "MissingGeminiKeyError") {
      return Response.json(
        {
          error:
            "Shopping chat is unavailable. Set GEMINI_API_KEY in your environment.",
        },
        { status: 503 },
      );
    }

    if (error instanceof Error && error.name === "GeminiQuotaError") {
      return Response.json({ error: error.message }, { status: 429 });
    }

    const message = error instanceof Error ? error.message : "Chat request failed";
    const isQuota =
      message.includes("429") ||
      message.includes("RESOURCE_EXHAUSTED") ||
      message.includes("quota") ||
      message.includes("limit: 0");

    if (isQuota) {
      return Response.json(
        {
          error:
            "Gemini free-tier quota is blocked for this model/key (limit: 0 is common and does not mean you used many messages). Try GEMINI_MODEL=gemini-2.5-flash, create a new AI Studio key/project, wait a minute, or check https://ai.dev/rate-limit",
        },
        { status: 429 },
      );
    }

    return Response.json({ error: message }, { status: 500 });
  }
}
