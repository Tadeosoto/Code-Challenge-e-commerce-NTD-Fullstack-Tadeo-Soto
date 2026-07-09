import { describe, expect, it } from "vitest";
import {
  computeProductValidationIssues,
  containsScriptTags,
  containsSuspiciousSqlPatterns,
  hasBlockingValidationIssues,
  MAX_STOCK,
} from "@/lib/validators/product-issues";

describe("product validation issues", () => {
  it("detects script tags in names", () => {
    expect(containsScriptTags("<script>alert('xss')</script>")).toBe(true);
    expect(containsScriptTags("Normal Product")).toBe(false);
  });

  it("returns blocking issues for invalid product fields", () => {
    const issues = computeProductValidationIssues({
      name: "",
      category: "Sports",
      price: 0,
      stock: 10,
      flags: { nameMissing: true },
    });

    expect(issues).toContain("Name is required");
    expect(issues).toContain("Price must be greater than 0");
    expect(hasBlockingValidationIssues(issues)).toBe(true);
  });

  it("blocks script tag names even when other fields are valid", () => {
    const issues = computeProductValidationIssues({
      name: "<script>alert(1)</script>",
      category: "Electronics",
      price: 19.99,
      stock: 100,
    });

    expect(issues).toContain("Script tags in name are not allowed");
  });

  it("flags obvious SQL injection patterns but allows normal apostrophes", () => {
    expect(containsSuspiciousSqlPatterns("Robert'); DROP TABLE products;--")).toBe(true);
    expect(containsSuspiciousSqlPatterns("O'Brien's Widget")).toBe(false);

    const issues = computeProductValidationIssues({
      name: "Robert'); DROP TABLE products;--",
      category: "Games",
      price: 9.99,
      stock: 50,
    });

    expect(issues).toContain("Suspicious SQL patterns in name");
  });

  it("flags free prices and negative stock with specific messages", () => {
    const freePrice = computeProductValidationIssues({
      name: "Yoga Mat",
      category: "Sports",
      price: 0,
      stock: 200,
      rawPrice: "free",
      flags: { priceInvalid: true },
    });
    expect(freePrice).toContain("Price cannot be free");

    const negativeStock = computeProductValidationIssues({
      name: "Desk Lamp",
      category: "Home & Office",
      price: 45.5,
      stock: 0,
      rawStock: "-5",
      flags: { stockInvalid: true },
    });
    expect(negativeStock).toContain("Stock cannot be negative");
  });

  it("flags stock above the configured maximum", () => {
    const issues = computeProductValidationIssues({
      name: "Gift Card",
      category: "Uncategorized",
      price: 25,
      stock: 99999,
      flags: { categoryMissing: true },
    });

    expect(issues).toContain("Category is required");
    expect(issues).toContain(`Stock exceeds maximum of ${MAX_STOCK.toLocaleString()}`);
  });
});
