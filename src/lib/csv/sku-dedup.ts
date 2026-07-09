/**
 * When the challenge CSV repeats a SKU with different row data, treat later rows as
 * distinct variants by appending a version suffix (e.g. RS-001 → RS-001-V2).
 */
export function assignUniqueSkuSuffixes<T extends { sku: string }>(rows: T[]): T[] {
  const seen = new Map<string, number>();

  return rows.map((row) => {
    const base = row.sku.trim();
    const occurrence = seen.get(base) ?? 0;
    seen.set(base, occurrence + 1);

    if (occurrence === 0) {
      return row;
    }

    return {
      ...row,
      sku: `${base}-V${occurrence + 1}`,
    };
  });
}
