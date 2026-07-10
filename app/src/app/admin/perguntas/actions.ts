"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { answerSchema } from "@/schemas/question-schema";
import { answerQuestion } from "@/services/question-service";
import { prisma } from "@/lib/prisma";

export async function answerQuestionAction(questionId: string, formData: FormData) {
  await requireAdmin();

  const parsed = answerSchema.safeParse({ answer: formData.get("answer") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Resposta inválida." };
  }

  const question = await answerQuestion(questionId, parsed.data.answer);
  const product = await prisma.product.findUnique({
    where: { id: question.productId },
    select: { slug: true },
  });

  revalidatePath("/admin/perguntas");
  if (product) revalidatePath(`/produto/${product.slug}`);
  return { success: true };
}
