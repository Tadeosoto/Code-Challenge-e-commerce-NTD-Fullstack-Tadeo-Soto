import { NextRequest } from "next/server";
import {
  deleteProduct,
  getProductById,
  updateProduct,
  updateProductAsOwner,
} from "@/lib/services/product.service";
import { productUpdateSchema } from "@/lib/validators/product";
import {
  forbiddenResponse,
  getSessionFromRequest,
  unauthorizedResponse,
} from "@/lib/session";
import { UserRole, ProductStatus } from "@/generated/prisma/client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const product = await getProductById(id);
  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
  return Response.json(product);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);
  const { id } = await context.params;

  if (!session) {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const parsed = productUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const sellerId = session.role === UserRole.SELLER ? session.userId : undefined;
    if (session.role !== UserRole.SELLER && session.role !== UserRole.OWNER) {
      return forbiddenResponse();
    }

    const product =
      session.role === UserRole.OWNER
        ? await updateProductAsOwner(id, parsed.data)
        : await updateProduct(id, parsed.data, sellerId);
    return Response.json({
      message:
        session.role === UserRole.OWNER
          ? product.status === ProductStatus.APPROVED
            ? "Product updated successfully."
            : product.validationIssues.length > 0
              ? "Product updated. Resolve validation issues before approving."
              : "Product updated and ready for approval."
          : "Product updated successfully — changes are pending owner approval before going live.",
      product,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return Response.json({ error: message }, { status: 403 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);
  const { id } = await context.params;

  if (!session) {
    return unauthorizedResponse();
  }

  if (session.role !== UserRole.SELLER && session.role !== UserRole.OWNER) {
    return forbiddenResponse("Only sellers or owners can delete products");
  }

  try {
    const existing = await getProductById(id);
    if (session.role === UserRole.OWNER) {
      await deleteProduct(id);
    } else {
      await deleteProduct(id, session.userId);
    }
    return Response.json({
      message: `Product "${existing?.name ?? id}" deleted successfully.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return Response.json({ error: message }, { status: 403 });
  }
}
