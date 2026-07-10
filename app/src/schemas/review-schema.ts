import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Escolha uma nota").max(5),
  comment: z
    .string()
    .trim()
    .max(1000, "Comentário muito longo")
    .optional()
    .or(z.literal("")),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
