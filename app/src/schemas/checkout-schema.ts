import { z } from "zod";

export const addressSchema = z.object({
  zipCode: z
    .string()
    .min(8, "CEP inválido")
    .max(9, "CEP inválido")
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  street: z.string().min(1, "Informe a rua"),
  number: z.string().min(1, "Informe o número"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Informe o bairro"),
  city: z.string().min(1, "Informe a cidade"),
  state: z
    .string()
    .length(2, "Use a sigla do estado (ex: SP)")
    .transform((v) => v.toUpperCase()),
  reference: z.string().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
