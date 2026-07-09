import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { UserRole } from "@/generated/prisma/client";

type DemoUserConfig = {
  role: UserRole;
  username: string;
  password: string;
  sellerName: string | null;
};

const DEMO_USERS: DemoUserConfig[] = [
  {
    role: UserRole.BUYER,
    username: "buyer",
    password: "buyer123",
    sellerName: null,
  },
  {
    role: UserRole.SELLER,
    username: "seller",
    password: "seller123",
    sellerName: null,
  },
  {
    role: UserRole.OWNER,
    username: "owner",
    password: "owner123",
    sellerName: null,
  },
];

function getDemoUserConfig(role: UserRole) {
  return DEMO_USERS.find((user) => user.role === role) ?? null;
}

async function ensureDemoUser(user: DemoUserConfig) {
  const passwordHash = await bcrypt.hash(user.password, 10);

  return prisma.user.upsert({
    where: { username: user.username },
    update: {
      passwordHash,
      role: user.role,
      sellerName: user.sellerName,
      sellerNumber: null,
    },
    create: {
      username: user.username,
      passwordHash,
      role: user.role,
      sellerName: user.sellerName,
      sellerNumber: null,
    },
  });
}

export async function ensureDemoUsers() {
  for (const user of DEMO_USERS) {
    await ensureDemoUser(user);
  }
}

export async function authenticateDemoUser(role: UserRole, username: string, password: string) {
  const expectedUser = getDemoUserConfig(role);
  const normalizedUsername = username.trim().toLowerCase();

  if (!expectedUser || normalizedUsername !== expectedUser.username) {
    return null;
  }

  let user = await prisma.user.findUnique({
    where: { username: expectedUser.username },
  });

  if (!user) {
    await ensureDemoUser(expectedUser);
    user = await prisma.user.findUnique({
      where: { username: expectedUser.username },
    });
  }

  if (!user || user.role !== role) {
    return null;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return null;
  }

  return user;
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
