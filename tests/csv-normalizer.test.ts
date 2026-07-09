import { describe, expect, it } from "vitest";
import {
  normalizePrice,
  normalizeStock,
  normalizeWeight,
  parseCsvRow,
  validateCsvRow,
} from "@/lib/csv/normalizer";

describe("csv normalizer", () => {
  it("parses currency-prefixed prices", () => {
    expect(normalizePrice("$29.99")).toBe(29.99);
  });

  it("rejects invalid prices", () => {
    expect(normalizePrice("free")).toBeNull();
    expect(normalizePrice("")).toBeNull();
  });

  it("rejects negative stock", () => {
    expect(normalizeStock("-5")).toBeNull();
  });

  it("accepts valid stock", () => {
    expect(normalizeStock("150")).toBe(150);
  });

  it("parses weight values", () => {
    expect(normalizeWeight("0.35")).toBe(0.35);
  });

  it("validates a complete row", () => {
    const result = validateCsvRow(
      {
        name: "Running Shoes",
        sku: "RS-001",
        description: "Test",
        category: "Footwear",
        price: "89.99",
        stock: "150",
        weight_kg: "0.35",
      },
      2,
    );

    expect("data" in result).toBe(true);
    if ("data" in result) {
      expect(result.data.sku).toBe("RS-001");
    }
  });

  it("skips empty rows", () => {
    const result = validateCsvRow({}, 10);
    expect("error" in result).toBe(true);
  });

  it("flags script tags in product names for pending review", () => {
    const result = parseCsvRow(
      {
        name: "<script>alert('xss')</script>",
        sku: "XS-001",
        description: "Test",
        category: "Electronics",
        price: "19.99",
        stock: "100",
        weight_kg: "0.1",
      },
      20,
    );

    expect("data" in result).toBe(true);
    if ("data" in result) {
      expect(result.data.validationIssues).toContain("Script tags in name are not allowed");
    }
  });

  it("flags suspicious SQL patterns in product names for pending review", () => {
    const result = parseCsvRow(
      {
        name: "Robert'); DROP TABLE products;--",
        sku: "SQL-001",
        description: "Test",
        category: "Games",
        price: "9.99",
        stock: "50",
        weight_kg: "0.2",
      },
      29,
    );

    expect("data" in result).toBe(true);
    if ("data" in result) {
      expect(result.data.validationIssues).toContain("Suspicious SQL patterns in name");
    }
  });

  it("keeps invalid rows with fallback values and issue tags", () => {
    const result = parseCsvRow(
      {
        name: "Yoga Mat",
        sku: "YM-015",
        description: "Premium mat",
        category: "Sports",
        price: "free",
        stock: "200",
        weight_kg: "1.2",
      },
      7,
    );

    expect("data" in result).toBe(true);
    if ("data" in result) {
      expect(result.data.price).toBe(0);
      expect(result.data.validationIssues).toContain("Price cannot be free");
    }
  });
});
