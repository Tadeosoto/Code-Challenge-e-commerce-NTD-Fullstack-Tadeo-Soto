import Papa from "papaparse";
import { CsvProductRow, ParsedProductRow, RowValidationError, parseCsvRow } from "./normalizer";

export type ImportPreviewResult = {
  rows: ParsedProductRow[];
  skipped: RowValidationError[];
};

export function parseCsvContent(content: string): ImportPreviewResult {
  const parsed = Papa.parse<CsvProductRow>(content, {
    header: true,
    skipEmptyLines: false,
    transformHeader: (header) => header.trim(),
  });

  const rows: ParsedProductRow[] = [];
  const skipped: RowValidationError[] = [];

  parsed.data.forEach((row, index) => {
    const rowNumber = index + 2;
    const result = parseCsvRow(row, rowNumber);
    if ("error" in result) {
      skipped.push(result.error);
      return;
    }
    rows.push(result.data);
  });

  if (parsed.errors.length > 0) {
    parsed.errors.forEach((error) => {
      skipped.push({
        row: (error.row ?? 0) + 1,
        reason: error.message,
      });
    });
  }

  return { rows, skipped };
}
