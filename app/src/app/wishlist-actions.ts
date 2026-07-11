"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { toggleWishlist } from "@/services/wishlist-service";

// Alterna favorito. Retorna redirect=true quando o usuario nao esta logado,
// para o client mandar ele pra tela de login.
export async function toggleWishlistAction(productId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { requiresLogin: true };
  }

  const result = await toggleWishlist(session.user.id, productId);
  revalidatePath("/", "layout");
  revalidatePath("/favoritos");
  return result;
}
