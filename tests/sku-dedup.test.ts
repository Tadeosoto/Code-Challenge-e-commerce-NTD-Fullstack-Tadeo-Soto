import { describe, expect, it } from "vitest";
import { assignUniqueSkuSuffixes } from "@/lib/csv/sku-dedup";

describe("SKU deduplication", () => {
  it("keeps the first occurrence and suffixes later duplicates", () => {
    const rows = [
      { sku: "RS-001", name: "Original" },
      { sku: "RS-001", name: "Revision" },
      { sku: "BS-021", name: "Speaker A" },
      { sku: "BS-021", name: "Speaker B" },
      { sku: "BS-021", name: "Speaker C" },
    ];

    const result = assignUniqueSkuSuffixes(rows);

    expect(result.map((row) => row.sku)).toEqual([
      "RS-001",
      "RS-001-V2",
      "BS-021",
      "BS-021-V2",
      "BS-021-V3",
    ]);
  });
});
