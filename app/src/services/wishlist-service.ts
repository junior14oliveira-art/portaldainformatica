import * as wishlistRepository from "@/repositories/wishlist-repository";

export function getWishlist(userId: string) {
  return wishlistRepository.findWishlistByUser(userId);
}

export async function getWishlistProductIdSet(userId: string) {
  const items = await wishlistRepository.findWishlistProductIds(userId);
  return new Set(items.map((item) => item.productId));
}

export function getWishlistCount(userId: string) {
  return wishlistRepository.countWishlist(userId);
}

// Alterna o produto na wishlist e retorna o novo estado (favoritado ou nao).
export async function toggleWishlist(userId: string, productId: string) {
  const existing = await wishlistRepository.isInWishlist(userId, productId);
  if (existing) {
    await wishlistRepository.removeFromWishlist(userId, productId);
    return { inWishlist: false };
  }
  await wishlistRepository.addToWishlist(userId, productId);
  return { inWishlist: true };
}
