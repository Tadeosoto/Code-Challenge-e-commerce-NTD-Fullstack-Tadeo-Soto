import { prisma } from "@/lib/db";
import { ProductInput, SearchQuery, ProductSort } from "@/lib/validators/product";
import {
  computeProductValidationIssues,
  hasBlockingValidationIssues,
  isPlaceholderCategory,
  isPlaceholderProductName,
} from "@/lib/validators/product-issues";
import { Prisma, ProductStatus, UserRole } from "@/generated/prisma/client";

function parseValidationIssues(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function serializeProduct(product: {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: Prisma.Decimal;
  stock: number;
  weightKg: Prisma.Decimal | null;
  status: ProductStatus;
  sellerId: string | null;
  validationIssues: unknown;
  approvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  seller?: { sellerName: string | null; username: string } | null;
}) {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    description: product.description,
    category: product.category,
    price: product.price.toNumber(),
    stock: product.stock,
    weightKg: product.weightKg?.toNumber() ?? null,
    status: product.status,
    sellerId: product.sellerId,
    sellerName: product.seller?.sellerName ?? null,
    sellerUsername: product.seller?.username ?? null,
    validationIssues: parseValidationIssues(product.validationIssues),
    approvedAt: product.approvedAt,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function buildValidationIssuesFromProduct(input: {
  name: string;
  sku?: string;
  category: string;
  price: number;
  stock: number;
}): string[] {
  const nameMissing = isPlaceholderProductName(input.name, input.sku);
  const categoryMissing = isPlaceholderCategory(input.category);

  return computeProductValidationIssues({
    name: nameMissing ? "" : input.name,
    category: categoryMissing ? "" : input.category,
    price: input.price,
    stock: input.stock,
    flags: {
      nameMissing,
      categoryMissing,
    },
  });
}

const productInclude = {
  seller: { select: { sellerName: true, username: true } },
} as const;

export async function listProducts(page = 1, limit = 20, sellerId?: string) {
  const skip = (page - 1) * limit;
  const where: Prisma.ProductWhereInput = sellerId ? { sellerId } : {};

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: items.map(serializeProduct),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function listPendingProducts() {
  const items = await prisma.product.findMany({
    where: { status: ProductStatus.PENDING },
    include: productInclude,
    orderBy: { createdAt: "asc" },
  });

  return Promise.all(
    items.map(async (product) => {
      const validationIssues = buildValidationIssuesFromProduct({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price.toNumber(),
        stock: product.stock,
      });

      const storedIssues = parseValidationIssues(product.validationIssues);
      const issuesChanged =
        storedIssues.length !== validationIssues.length ||
        storedIssues.some((issue, index) => issue !== validationIssues[index]);

      if (issuesChanged) {
        await prisma.product.update({
          where: { id: product.id },
          data: { validationIssues },
        });
      }

      return serializeProduct({ ...product, validationIssues });
    }),
  );
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
  return product ? serializeProduct(product) : null;
}

export async function createProduct(input: ProductInput, sellerId: string) {
  const validationIssues = buildValidationIssuesFromProduct(input);
  if (hasBlockingValidationIssues(validationIssues)) {
    throw new Error(validationIssues.join("; "));
  }

  const product = await prisma.product.create({
    data: {
      name: input.name,
      sku: input.sku,
      description: input.description ?? "",
      category: input.category,
      price: input.price,
      stock: input.stock,
      weightKg: input.weightKg ?? null,
      sellerId,
      status: ProductStatus.PENDING,
      validationIssues: [],
    },
    include: productInclude,
  });
  return serializeProduct(product);
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>,
  sellerId?: string,
) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Product not found");
  }
  if (sellerId && existing.sellerId !== sellerId) {
    throw new Error("You can only edit your own products");
  }

  const next = {
    name: input.name ?? existing.name,
    sku: input.sku ?? existing.sku,
    description: input.description ?? existing.description,
    category: input.category ?? existing.category,
    price: input.price ?? existing.price.toNumber(),
    stock: input.stock ?? existing.stock,
    weightKg: input.weightKg !== undefined ? input.weightKg : existing.weightKg?.toNumber() ?? null,
  };

  const validationIssues = buildValidationIssuesFromProduct({
    name: next.name,
    sku: next.sku,
    category: next.category,
    price: next.price,
    stock: next.stock,
  });
  if (sellerId && hasBlockingValidationIssues(validationIssues)) {
    throw new Error(validationIssues.join("; "));
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: next.name,
      sku: next.sku,
      description: next.description,
      category: next.category,
      price: next.price,
      stock: next.stock,
      weightKg: next.weightKg,
      validationIssues,
      ...(sellerId
        ? { status: ProductStatus.PENDING, approvedAt: null }
        : { status: ProductStatus.PENDING, approvedAt: null }),
    },
    include: productInclude,
  });
  return serializeProduct(product);
}

export async function updateProductAsOwner(id: string, input: Partial<ProductInput>) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Product not found");
  }

  const next = {
    name: input.name ?? existing.name,
    sku: input.sku ?? existing.sku,
    description: input.description ?? existing.description,
    category: input.category ?? existing.category,
    price: input.price ?? existing.price.toNumber(),
    stock: input.stock ?? existing.stock,
    weightKg: input.weightKg !== undefined ? input.weightKg : existing.weightKg?.toNumber() ?? null,
  };

  const validationIssues = buildValidationIssuesFromProduct({
    name: next.name,
    sku: next.sku,
    category: next.category,
    price: next.price,
    stock: next.stock,
  });
  const hasIssues = hasBlockingValidationIssues(validationIssues);

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: next.name,
      sku: next.sku,
      description: next.description,
      category: next.category,
      price: next.price,
      stock: next.stock,
      weightKg: next.weightKg,
      validationIssues,
      status: hasIssues ? ProductStatus.PENDING : ProductStatus.APPROVED,
      approvedAt: hasIssues ? null : (existing.approvedAt ?? new Date()),
    },
    include: productInclude,
  });
  return serializeProduct(product);
}

export async function deleteProduct(id: string, sellerId?: string) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Product not found");
  }
  if (sellerId && existing.sellerId !== sellerId) {
    throw new Error("You can only delete your own products");
  }
  await prisma.product.delete({ where: { id } });
}

export async function approveProduct(id: string) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Product not found");
  }

  const validationIssues = buildValidationIssuesFromProduct({
    name: existing.name,
    sku: existing.sku,
    category: existing.category,
    price: existing.price.toNumber(),
    stock: existing.stock,
  });

  if (hasBlockingValidationIssues(validationIssues)) {
    throw new Error(
      `Cannot approve until issues are resolved: ${validationIssues.join("; ")}`,
    );
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      status: ProductStatus.APPROVED,
      approvedAt: new Date(),
      validationIssues: [],
    },
    include: productInclude,
  });
  return serializeProduct(product);
}

export async function rejectProduct(id: string) {
  const product = await prisma.product.update({
    where: { id },
    data: {
      status: ProductStatus.REJECTED,
      approvedAt: null,
    },
    include: productInclude,
  });
  return serializeProduct(product);
}

function getSearchOrderBy(sort: ProductSort): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "name-desc":
      return { name: "desc" };
    case "date-asc":
      return { createdAt: "asc" };
    case "date-desc":
      return { createdAt: "desc" };
    case "name-asc":
    default:
      return { name: "asc" };
  }
}

export async function searchProducts(query: SearchQuery, approvedOnly = true) {
  const { q, category, sort, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {
    ...(approvedOnly ? { status: ProductStatus.APPROVED } : {}),
    ...(category ? { category: { equals: category, mode: "insensitive" } } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { category: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: getSearchOrderBy(sort),
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: items.map(serializeProduct),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function listCategories(approvedOnly = true) {
  const categories = await prisma.product.findMany({
    where: approvedOnly ? { status: ProductStatus.APPROVED } : {},
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });
  return categories.map((item) => item.category);
}

export function canManageProduct(
  role: UserRole,
  productSellerId: string | null,
  userId: string,
) {
  if (role === UserRole.OWNER) return true;
  if (role === UserRole.SELLER) return productSellerId === userId;
  return false;
}
