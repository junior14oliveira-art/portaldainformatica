import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(1, "Informe o título"),
  slug: z
    .string()
    .min(1, "Informe o slug")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens"),
  authorName: z.string().optional(),
  content: z.string().min(1, "Escreva o conteúdo do artigo"),
  imageUrl: z.string().url("URL de imagem inválida").optional().or(z.literal("")),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  published: z.coerce.boolean().optional(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
