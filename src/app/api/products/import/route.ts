import { NextRequest } from "next/server";
import { listImportLogs, importProductsFromCsv } from "@/lib/services/import.service";
import {
  getSessionFromRequest,
  requireRole,
  unauthorizedResponse,
} from "@/lib/session";
import { UserRole } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!requireRole(session, [UserRole.OWNER])) {
    return unauthorizedResponse();
  }

  const logs = await listImportLogs();
  return Response.json({ logs });
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!requireRole(session, [UserRole.OWNER])) {
    return unauthorizedResponse();
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "CSV file is required" }, { status: 400 });
  }

  const content = await file.text();
  const result = await importProductsFromCsv(content, file.name);
    return Response.json({
      message: `CSV import complete: ${result.imported} imported, ${result.updated} updated, ${result.pendingReview} pending review, ${result.skipped} skipped.`,
      ...result,
    });
}
