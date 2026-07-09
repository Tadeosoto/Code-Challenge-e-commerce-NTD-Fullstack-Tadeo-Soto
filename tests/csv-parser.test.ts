import { describe, expect, it } from "vitest";
import { parseCsvContent } from "@/lib/csv/parser";
import { readFileSync } from "fs";
import path from "path";

describe("csv parser", () => {
  it("parses the challenge CSV and quarantines invalid rows", () => {
    const filePath = path.join(process.cwd(), "data", "NTD Code Challenge E-Commerce.csv");
    const content = readFileSync(filePath, "utf-8");
    const result = parseCsvContent(content);

    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.skipped.length).toBeGreaterThan(0);

    const xssRow = result.rows.find((row) => row.sku === "XS-001");
    expect(xssRow?.validationIssues).toContain("Script tags in name are not allowed");

    const sqlRow = result.rows.find((row) => row.sku === "SQL-001");
    expect(sqlRow?.validationIssues).toContain("Suspicious SQL patterns in name");

    const invalidPrice = result.rows.find((row) => row.sku === "YM-015");
    expect(invalidPrice?.validationIssues).toContain("Price cannot be free");

    const negativeStock = result.rows.find((row) => row.sku === "DL-007");
    expect(negativeStock?.validationIssues).toContain("Stock cannot be negative");

    const giftCard = result.rows.find((row) => row.sku === "GC-025");
    expect(giftCard?.validationIssues).toContain("Category is required");
    expect(giftCard?.validationIssues).toContain("Stock exceeds maximum of 10,000");

    expect(result.rows.some((row) => row.sku === "RS-001" && row.validationIssues.length === 0)).toBe(true);
    expect(result.rows.some((row) => row.sku === "RS-001-V2")).toBe(true);
    expect(result.rows.some((row) => row.sku === "BS-021-V2")).toBe(true);
  });

  it("handles quoted commas in product names", () => {
    const csv = `name,sku,description,category,price,stock,weight_kg
"Comma, In Product Name",CI-001,desc,Accessories,14.99,300,0.1`;

    const result = parseCsvContent(csv);
    expect(result.rows[0]?.name).toBe("Comma, In Product Name");
  });
});
