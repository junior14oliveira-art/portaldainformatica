import { prisma } from "@/lib/prisma";
import type { AddressInput } from "@/schemas/checkout-schema";

export function findAddressesByUser(userId: string) {
  return prisma.address.findMany({
    where: { userId, deletedAt: null },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export function findAddressById(id: string, userId: string) {
  return prisma.address.findFirst({ where: { id, userId, deletedAt: null } });
}

export async function createAddress(userId: string, data: AddressInput) {
  const existingCount = await prisma.address.count({ where: { userId, deletedAt: null } });
  return prisma.address.create({
    data: {
      ...data,
      userId,
      isDefault: existingCount === 0,
    },
  });
}
