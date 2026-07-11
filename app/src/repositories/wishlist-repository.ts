import { prisma } from "@/lib/prisma";

// Favoritos (wishlist) — exige usuario logado (userId obrigatorio no schema,
// diferente do carrinho que aceita sessao de convidado).
export function findWishlistByUser(userId: string) {
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          brand: true,
          images: { where: { isMain: true }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function findWishlistProductIds(userId: string) {
  return prisma.wishlistItem.findMany({
    where: { userId },
    select: { productId: true },
  });
}

export function isInWishlist(userId: string, productId: string) {
  return prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
}

export function addToWishlist(userId: string, productId: string) {
  return prisma.wishlistItem.create({ data: { userId, productId } });
}

export function removeFromWishlist(userId: string, productId: string) {
  return prisma.wishlistItem.delete({
    where: { userId_productId: { userId, productId } },
  });
}

export function countWishlist(userId: string) {
  return prisma.wishlistItem.count({ where: { userId } });
}
