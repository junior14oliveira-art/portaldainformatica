"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

// Alterna a aprovacao de uma avaliacao (moderacao manual pelo admin).
// As avaliacoes novas ja nascem aprovadas (ver review-service.ts) enquanto
// nao houver fila de moderacao antes da publicacao; este toggle serve para
// remover avaliacoes indevidas depois de publicadas.
export async function toggleReviewApprovalAction(reviewId: string, approved: boolean) {
  await requireAdmin();
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { approved },
    select: { product: { select: { slug: true } } },
  });
  revalidatePath("/admin/avaliacoes");
  revalidatePath(`/produto/${review.product.slug}`);
}
