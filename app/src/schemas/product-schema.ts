import { z } from "zod";

export const productSchema = z.object({
  sku: z.string().min(1, "Informe o SKU"),
  name: z.string().min(1, "Informe o nome"),
  slug: z
    .string()
    .min(1, "Informe o slug")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens"),
  categoryId: z.string().min(1, "Escolha uma categoria"),
  brandId: z.string().optional(),
  shortDescription: z.string().max(300).optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive("Preço deve ser maior que zero"),
  pricePix: z.coerce.number().positive().optional().or(z.literal(0)),
  warrantyMonths: z.coerce.number().int().min(0).optional(),
  imageUrl: z.string().url("URL de imagem inválida").optional().or(z.literal("")),
  active: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
