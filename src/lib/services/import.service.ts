import { prisma } from "@/lib/db";
import { parseCsvContent } from "@/lib/csv/parser";
import { assignUniqueSkuSuffixes } from "@/lib/csv/sku-dedup";
import { ParsedProductRow, RowValidationError } from "@/lib/csv/normalizer";
import { ProductStatus } from "@/generated/prisma/client";

export type ImportResult = {
  imported: number;
  updated: number;
  pendingReview: number;
  skipped: number;
  errors: RowValidationError[];
  importLogId: string;
};

export async function importProductsFromCsv(
  content: string,
  filename: string,
): Promise<ImportResult> {
  const { rows: parsedRows, skipped } = parseCsvContent(content);
  const rows = assignUniqueSkuSuffixes(parsedRows);
  let imported = 0;
  let updated = 0;
  let pendingReview = 0;
  const errors: RowValidationError[] = [...skipped];

  for (const row of rows) {
    try {
      const result = await upsertProductRow(row);
      if (result === "created") imported += 1;
      if (result === "updated") updated += 1;
      if (row.validationIssues.length > 0) pendingReview += 1;
    } catch (error) {
      errors.push({
        row: 0,
        sku: row.sku,
        reason: error instanceof Error ? error.message : "Failed to upsert row",
      });
    }
  }

  const importLog = await prisma.importLog.create({
    data: {
      filename,
      imported,
      updated,
      skipped: errors.length,
      errors,
    },
  });

  return {
    imported,
    updated,
    pendingReview,
    skipped: errors.length,
    errors,
    importLogId: importLog.id,
  };
}

async function upsertProductRow(row: ParsedProductRow): Promise<"created" | "updated"> {
  const needsReview = row.validationIssues.length > 0;
  const status = needsReview ? ProductStatus.PENDING : ProductStatus.APPROVED;
  const approvedAt = needsReview ? null : new Date();

  const existing = await prisma.product.findUnique({ where: { sku: row.sku } });

  if (existing) {
    await prisma.product.update({
      where: { sku: row.sku },
      data: {
        name: row.name,
        description: row.description,
        category: row.category,
        price: row.price,
        stock: row.stock,
        weightKg: row.weightKg,
        validationIssues: row.validationIssues,
        status,
        approvedAt,
      },
    });
    return "updated";
  }

  await prisma.product.create({
    data: {
      name: row.name,
      sku: row.sku,
      description: row.description,
      category: row.category,
      price: row.price,
      stock: row.stock,
      weightKg: row.weightKg,
      validationIssues: row.validationIssues,
      status,
      approvedAt,
    },
  });
  return "created";
}

export async function listImportLogs(limit = 10) {
  return prisma.importLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
