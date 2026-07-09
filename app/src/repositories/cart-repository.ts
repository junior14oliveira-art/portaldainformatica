import { prisma } from "@/lib/prisma";

export function findCartItemsBySession(sessionId: string) {
  return prisma.cartItem.findMany({
    where: { sessionId },
    include: {
      product: {
        include: {
          brand: true,
          images: { where: { isMain: true }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export function findCartItem(sessionId: string, productId: string) {
  return prisma.cartItem.findFirst({
    where: { sessionId, productId },
  });
}

export function createCartItem(
  sessionId: string,
  productId: string,
  quantity: number
) {
  return prisma.cartItem.create({
    data: { sessionId, productId, quantity },
  });
}

export function updateCartItemQuantity(id: string, quantity: number) {
  return prisma.cartItem.update({
    where: { id },
    data: { quantity },
  });
}

export function deleteCartItem(id: string) {
  return prisma.cartItem.delete({ where: { id } });
}

export function deleteCartItemsBySession(sessionId: string) {
  return prisma.cartItem.deleteMany({ where: { sessionId } });
}
