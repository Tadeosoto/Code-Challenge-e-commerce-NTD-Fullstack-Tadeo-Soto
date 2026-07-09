-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "validationIssues" JSONB NOT NULL DEFAULT '[]';
