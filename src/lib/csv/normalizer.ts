import { computeProductValidationIssues } from "@/lib/validators/product-issues";

export type CsvProductRow = {
  name?: string;
  sku?: string;
  description?: string;
  category?: string;
  price?: string;
  stock?: string;
  weight_kg?: string;
};

export type ParsedProductRow = {
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  weightKg: number | null;
  validationIssues: string[];
};

export type RowValidationError = {
  row: number;
  sku?: string;
  reason: string;
};

export function normalizePrice(raw: string | undefined): number | null {
  if (raw === undefined || raw === null) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const cleaned = trimmed.replace(/^\$/, "").replace(/,/g, "");
  if (/^free$/i.test(cleaned)) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100) / 100;
}

export function normalizeStock(raw: string | undefined): number | null {
  if (raw === undefined || raw === null) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const value = Number(trimmed);
  if (!Number.isInteger(value) || value < 0) return null;
  return value;
}

export function normalizeWeight(raw: string | undefined): number | null {
  if (raw === undefined || raw === null) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 1000) / 1000;
}

export function parseCsvRow(
  row: CsvProductRow,
  rowNumber: number,
): { data: ParsedProductRow } | { error: RowValidationError } {
  const rawName = row.name ?? "";
  const nameTrimmed = rawName.trim();
  const sku = row.sku?.trim() ?? "";
  const description = row.description?.trim() ?? "";
  const categoryTrimmed = row.category?.trim() ?? "";
  const priceRaw = normalizePrice(row.price);
  const stockRaw = normalizeStock(row.stock);
  const weightKg = normalizeWeight(row.weight_kg);

  if (!nameTrimmed && !sku && !categoryTrimmed && !row.price && !row.stock) {
    return { error: { row: rowNumber, reason: "Empty row" } };
  }

  if (!sku) {
    return { error: { row: rowNumber, reason: "SKU is required" } };
  }

  const nameMissing = !nameTrimmed;
  const categoryMissing = !categoryTrimmed;
  const priceInvalid = priceRaw === null;
  const stockInvalid = stockRaw === null;

  const name = nameMissing
    ? `Pending: ${sku}`
    : nameTrimmed;

  const category = categoryMissing ? "Uncategorized" : categoryTrimmed;
  const price = priceInvalid ? 0 : priceRaw;
  const stock = stockInvalid ? 0 : stockRaw;

  const validationIssues = computeProductValidationIssues({
    name: nameMissing ? "" : nameTrimmed,
    category: categoryMissing ? "" : categoryTrimmed,
    price,
    stock,
    rawPrice: row.price,
    rawStock: row.stock,
    flags: {
      nameMissing,
      categoryMissing,
      priceInvalid,
      stockInvalid,
    },
  });

  return {
    data: {
      name,
      sku,
      description,
      category,
      price,
      stock,
      weightKg,
      validationIssues,
    },
  };
}

export function validateCsvRow(
  row: CsvProductRow,
  rowNumber: number,
): { data: Omit<ParsedProductRow, "validationIssues"> } | { error: RowValidationError } {
  const result = parseCsvRow(row, rowNumber);
  if ("error" in result) {
    return result;
  }

  if (result.data.validationIssues.length > 0) {
    return { error: { row: rowNumber, sku: result.data.sku, reason: result.data.validationIssues.join("; ") } };
  }

  const { validationIssues: _, ...data } = result.data;
  return { data };
}
