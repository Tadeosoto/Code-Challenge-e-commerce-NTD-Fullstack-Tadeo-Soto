import "dotenv/config";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import path from "path";
import { prisma } from "../src/lib/db";
import { importProductsFromCsv } from "../src/lib/services/import.service";
import { UserRole } from "../src/generated/prisma/client";

async function main() {
  const ownerPassword = await bcrypt.hash("owner123", 10);
  await prisma.user.upsert({
    where: { username: "owner" },
    update: {},
    create: {
      username: "owner",
      passwordHash: ownerPassword,
      role: UserRole.OWNER,
    },
  });

  const csvPath = path.join(process.cwd(), "data", "NTD Code Challenge E-Commerce.csv");
  const csvContent = readFileSync(csvPath, "utf-8");
  const result = await importProductsFromCsv(csvContent, "NTD Code Challenge E-Commerce.csv");

  console.log("Seed complete. Owner login: owner / owner123");
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
