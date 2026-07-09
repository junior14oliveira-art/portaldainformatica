import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(1, "Informe seu nome"),
  lastName: z.string().min(1, "Informe seu sobrenome"),
  email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
