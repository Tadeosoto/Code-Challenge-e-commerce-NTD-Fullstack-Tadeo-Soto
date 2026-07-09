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
