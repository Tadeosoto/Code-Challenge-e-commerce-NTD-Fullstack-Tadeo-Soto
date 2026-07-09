export const MAX_STOCK = 10_000;

export function containsScriptTags(value: string): boolean {
  return /<script\b/i.test(value) || /<\/script>/i.test(value);
}

const SUSPICIOUS_SQL_PATTERNS = [
  /';/,
  /'\s*\)\s*;/,
  /"\s*--/,
  /'\s*--/,
  /;\s*--/,
  /\bUNION\s+SELECT\b/i,
  /\bDROP\s+TABLE\b/i,
  /\bDELETE\s+FROM\b/i,
  /\bTRUNCATE\s+TABLE\b/i,
  /\bOR\s+1\s*=\s*1\b/i,
  /\bINSERT\s+INTO\b/i,
] as const;

export function containsSuspiciousSqlPatterns(value: string): boolean {
  return SUSPICIOUS_SQL_PATTERNS.some((pattern) => pattern.test(value));
}

export function isPlaceholderProductName(name: string, sku?: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return true;
  if (sku && trimmed === `Pending: ${sku}`) return true;
  return false;
}

export function isPlaceholderCategory(category: string): boolean {
  const trimmed = category.trim();
  return !trimmed || trimmed === "Uncategorized";
}

export type ProductFieldInput = {
  name: string;
  category: string;
  price: number;
  stock: number;
  rawPrice?: string;
  rawStock?: string;
  flags?: {
    nameMissing?: boolean;
    categoryMissing?: boolean;
    priceInvalid?: boolean;
    stockInvalid?: boolean;
  };
};

function appendPriceIssues(
  issues: string[],
  input: ProductFieldInput,
  flags: NonNullable<ProductFieldInput["flags"]>,
) {
  if (flags.priceInvalid) {
    const raw = input.rawPrice?.trim() ?? "";
    if (/^free$/i.test(raw)) {
      issues.push("Price cannot be free");
      return;
    }
    if (!raw) {
      issues.push("Price is required");
      return;
    }
    issues.push("Invalid price format");
    return;
  }

  if (input.price <= 0) {
    issues.push("Price must be greater than 0");
  }
}

function appendStockIssues(
  issues: string[],
  input: ProductFieldInput,
  flags: NonNullable<ProductFieldInput["flags"]>,
) {
  if (flags.stockInvalid) {
    const raw = input.rawStock?.trim() ?? "";
    const parsed = Number(raw);
    if (raw && Number.isFinite(parsed) && parsed < 0) {
      issues.push("Stock cannot be negative");
      return;
    }
    if (!raw) {
      issues.push("Stock is required");
      return;
    }
    issues.push("Invalid stock value");
    return;
  }

  if (input.stock <= 0) {
    issues.push("Stock must be greater than 0");
    return;
  }

  if (input.stock > MAX_STOCK) {
    issues.push(`Stock exceeds maximum of ${MAX_STOCK.toLocaleString()}`);
  }
}

export function computeProductValidationIssues(input: ProductFieldInput): string[] {
  const issues: string[] = [];
  const flags = input.flags ?? {};

  if (flags.nameMissing || !input.name.trim()) {
    issues.push("Name is required");
  }

  if (input.name.trim() && containsScriptTags(input.name)) {
    issues.push("Script tags in name are not allowed");
  }

  if (input.name.trim() && containsSuspiciousSqlPatterns(input.name)) {
    issues.push("Suspicious SQL patterns in name");
  }

  if (flags.categoryMissing || isPlaceholderCategory(input.category)) {
    if (!issues.includes("Category is required")) {
      issues.push("Category is required");
    }
  }

  appendPriceIssues(issues, input, flags);
  appendStockIssues(issues, input, flags);

  return issues;
}

export function hasBlockingValidationIssues(issues: string[]): boolean {
  return issues.length > 0;
}
