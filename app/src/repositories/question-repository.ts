import { prisma } from "@/lib/prisma";

// Perguntas e respostas de produto — mesmo padrao das avaliacoes (Review),
// mas aqui a resposta e dada pelo admin/loja, nao por outro cliente.
export function findQuestionsByProduct(productId: string) {
  return prisma.question.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function createQuestion(productId: string, userId: string, question: string) {
  return prisma.question.create({
    data: { productId, userId, question },
  });
}

export function findAllQuestions(onlyUnanswered?: boolean) {
  return prisma.question.findMany({
    where: onlyUnanswered ? { answer: null } : undefined,
    include: {
      user: { select: { name: true } },
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function answerQuestion(id: string, answer: string) {
  return prisma.question.update({
    where: { id },
    data: { answer, answeredAt: new Date() },
  });
}
