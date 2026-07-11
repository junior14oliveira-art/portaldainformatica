import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getWishlistProductIdSet } from "@/services/wishlist-service";

// Helper para as paginas da loja: devolve o conjunto de IDs de produtos
// favoritados pelo usuario logado (vazio se nao houver sessao). Assim o
// ProductCard ja renderiza o coracao no estado certo no primeiro paint.
export async function getCurrentUserWishlist(): Promise<Set<string>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Set();
  return getWishlistProductIdSet(session.user.id);
}
