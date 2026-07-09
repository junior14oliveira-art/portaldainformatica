"use server";

import { revalidatePath } from "next/cache";
import { getCartSessionId } from "@/lib/cart-session";
import * as cartService from "@/services/cart-service";

export async function addToCartAction(productId: string, quantity = 1) {
  const sessionId = await getCartSessionId();
  await cartService.addItem(sessionId, productId, quantity);
  revalidatePath("/", "layout");
}

export async function updateCartItemAction(cartItemId: string, quantity: number) {
  const sessionId = await getCartSessionId();
  await cartService.updateItemQuantity(sessionId, cartItemId, quantity);
  revalidatePath("/", "layout");
}

export async function removeCartItemAction(cartItemId: string) {
  await cartService.removeItem(cartItemId);
  revalidatePath("/", "layout");
}
