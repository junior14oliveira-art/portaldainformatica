import * as cartRepository from "@/repositories/cart-repository";
import { prisma } from "@/lib/prisma";

const MAX_QUANTITY_PER_ITEM = 20;

export type CartSummary = {
  items: {
    id: string;
    productId: string;
    slug: string;
    name: string;
    brand: string | null;
    imageUrl: string | null;
    imageAlt: string | null;
    quantity: number;
    unitPrice: number;
    unitPricePix: number | null;
    lineTotal: number;
  }[];
  itemCount: number;
  subtotal: number;
};

export async function getCart(sessionId: string): Promise<CartSummary> {
  const items = await cartRepository.findCartItemsBySession(sessionId);

  const mapped = items.map((item) => {
    const unitPrice = Number(item.product.price);
    const unitPricePix = item.product.pricePix
      ? Number(item.product.pricePix)
      : null;
    return {
      id: item.id,
      productId: item.productId,
      slug: item.product.slug,
      name: item.product.name,
      brand: item.product.brand?.name ?? null,
      imageUrl: item.product.images[0]?.url ?? null,
      imageAlt: item.product.images[0]?.altText ?? null,
      quantity: item.quantity,
      unitPrice,
      unitPricePix,
      lineTotal: (unitPricePix ?? unitPrice) * item.quantity,
    };
  });

  return {
    items: mapped,
    itemCount: mapped.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: mapped.reduce((sum, item) => sum + item.lineTotal, 0),
  };
}

export async function getCartItemCount(sessionId: string): Promise<number> {
  const items = await cartRepository.findCartItemsBySession(sessionId);
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export async function addItem(sessionId: string, productId: string, quantity = 1) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active) {
    throw new Error("Produto indisponível.");
  }

  const existing = await cartRepository.findCartItem(sessionId, productId);
  if (existing) {
    const nextQuantity = Math.min(
      existing.quantity + quantity,
      MAX_QUANTITY_PER_ITEM
    );
    return cartRepository.updateCartItemQuantity(existing.id, nextQuantity);
  }

  return cartRepository.createCartItem(
    sessionId,
    productId,
    Math.min(quantity, MAX_QUANTITY_PER_ITEM)
  );
}

export async function updateItemQuantity(
  sessionId: string,
  cartItemId: string,
  quantity: number
) {
  if (quantity <= 0) {
    return cartRepository.deleteCartItem(cartItemId);
  }
  const clamped = Math.min(quantity, MAX_QUANTITY_PER_ITEM);
  return cartRepository.updateCartItemQuantity(cartItemId, clamped);
}

export async function removeItem(cartItemId: string) {
  return cartRepository.deleteCartItem(cartItemId);
}

export async function clearCart(sessionId: string) {
  return cartRepository.deleteCartItemsBySession(sessionId);
}
