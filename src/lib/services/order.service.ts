import { prisma } from "@/lib/db";
import { CheckoutInput } from "@/lib/validators/product";
import { ProductStatus } from "@/generated/prisma/client";

export class CheckoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutError";
  }
}

export async function checkout(input: CheckoutInput, buyerId: string) {
  return prisma.$transaction(async (tx) => {
    const productIds = input.items.map((item) => item.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds }, status: ProductStatus.APPROVED },
    });

    const productMap = new Map(products.map((product) => [product.id, product]));
    let total = 0;
    const lineItems: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
    }> = [];

    for (const item of input.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new CheckoutError(`Product not found or not approved: ${item.productId}`);
      }
      if (product.stock < item.quantity) {
        throw new CheckoutError(
          `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        );
      }
      const unitPrice = product.price.toNumber();
      total += unitPrice * item.quantity;
      lineItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
      });
    }

    const order = await tx.order.create({
      data: {
        status: "PAID",
        total,
        buyerId,
        items: {
          create: lineItems.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    for (const line of lineItems) {
      const updated = await tx.product.updateMany({
        where: {
          id: line.productId,
          stock: { gte: line.quantity },
        },
        data: {
          stock: { decrement: line.quantity },
        },
      });

      if (updated.count !== 1) {
        throw new CheckoutError("Stock changed during checkout. Please retry.");
      }
    }

    return {
      id: order.id,
      status: order.status,
      total: order.total.toNumber(),
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toNumber(),
        product: {
          id: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
        },
      })),
    };
  });
}

export async function getOrderById(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) return null;

  return {
    id: order.id,
    status: order.status,
    total: order.total.toNumber(),
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toNumber(),
      product: {
        id: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
      },
    })),
  };
}
