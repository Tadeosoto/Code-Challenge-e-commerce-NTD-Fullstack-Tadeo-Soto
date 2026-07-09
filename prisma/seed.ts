import "dotenv/config";
import { readFileSync } from "fs";
import path from "path";
import { prisma } from "../src/lib/db";
import { ensureDemoUsers } from "../src/lib/services/auth.service";
import { importProductsFromCsv } from "../src/lib/services/import.service";

async function main() {
  await ensureDemoUsers();

  const csvPath = path.join(process.cwd(), "data", "NTD Code Challenge E-Commerce.csv");
  const csvContent = readFileSync(csvPath, "utf-8");
  const result = await importProductsFromCsv(csvContent, "NTD Code Challenge E-Commerce.csv");

  console.log("Seed complete. Demo users: buyer / buyer123, seller / seller123, owner / owner123");
  console.log(
    `CSV import: ${result.imported} imported, ${result.updated} updated, ${result.pendingReview} pending review, ${result.skipped} skipped.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
