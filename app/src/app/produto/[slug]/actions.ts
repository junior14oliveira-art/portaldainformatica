"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { reviewSchema } from "@/schemas/review-schema";
import { submitReview } from "@/services/review-service";

export async function submitReviewAction(
  productId: string,
  slug: string,
  formData: FormData
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Você precisa entrar na sua conta para avaliar." };
  }

  const parsed = reviewSchema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await submitReview(session.user.id, productId, parsed.data);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao enviar avaliação." };
  }

  revalidatePath(`/produto/${slug}`);
  return { success: true };
}
