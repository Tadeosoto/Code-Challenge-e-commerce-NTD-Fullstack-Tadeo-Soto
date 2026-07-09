import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { UserRole } from "@/generated/prisma/client";

const DUMMY_PASSWORD = "dummy";

export async function loginAsRole(role: UserRole) {
  if (role === UserRole.OWNER) {
    let owner = await prisma.user.findFirst({ where: { role: UserRole.OWNER } });
    if (!owner) {
      owner = await prisma.user.create({
        data: {
          username: "owner",
          passwordHash: await bcrypt.hash(DUMMY_PASSWORD, 10),
          role: UserRole.OWNER,
        },
      });
    }
    return owner;
  }

  if (role === UserRole.BUYER) {
    let buyer = await prisma.user.findFirst({ where: { role: UserRole.BUYER, username: "demo-buyer" } });
    if (!buyer) {
      buyer = await prisma.user.create({
        data: {
          username: "demo-buyer",
          passwordHash: await bcrypt.hash(DUMMY_PASSWORD, 10),
          role: UserRole.BUYER,
        },
      });
    }
    return buyer;
  }

  return prisma.$transaction(async (tx) => {
    const maxSeller = await tx.user.aggregate({
      where: { role: UserRole.SELLER },
      _max: { sellerNumber: true },
    });
    const sellerNumber = (maxSeller._max.sellerNumber ?? 0) + 1;
    const sellerName = `seller${sellerNumber}`;

    return tx.user.create({
      data: {
        username: sellerName,
        passwordHash: await bcrypt.hash(DUMMY_PASSWORD, 10),
        role: UserRole.SELLER,
        sellerNumber,
        sellerName,
      },
    });
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      role: true,
      sellerName: true,
      sellerNumber: true,
    },
  });
}
