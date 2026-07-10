import { z } from "zod";

export const questionSchema = z.object({
  question: z.string().trim().min(5, "Escreva a pergunta com pelo menos 5 caracteres").max(500),
});

export type QuestionInput = z.infer<typeof questionSchema>;

export const answerSchema = z.object({
  answer: z.string().trim().min(1, "Escreva uma resposta").max(1000),
});

export type AnswerInput = z.infer<typeof answerSchema>;
