"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { registerSchema, type RegisterInput } from "@/schemas/auth-schema";
import styles from "./AuthForm.module.css";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: `${data.firstName} ${data.lastName}`.trim(),
      firstName: data.firstName,
      lastName: data.lastName,
    });

    if (error) {
      setServerError(
        error.message?.includes("already exists")
          ? "Já existe uma conta com este e-mail."
          : "Não foi possível criar sua conta. Tente novamente."
      );
      return;
    }

    router.push("/minha-conta");
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="firstName">Nome</label>
          <input id="firstName" autoComplete="given-name" {...register("firstName")} />
          {errors.firstName ? (
            <span className={styles.error}>{errors.firstName.message}</span>
          ) : null}
        </div>
        <div className={styles.field}>
          <label htmlFor="lastName">Sobrenome</label>
          <input id="lastName" autoComplete="family-name" {...register("lastName")} />
          {errors.lastName ? (
            <span className={styles.error}>{errors.lastName.message}</span>
          ) : null}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email ? <span className={styles.error}>{errors.email.message}</span> : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password ? (
          <span className={styles.error}>{errors.password.message}</span>
        ) : null}
      </div>

      {serverError ? <p className={styles.serverError}>{serverError}</p> : null}

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? <Loader2 size={18} className="spin" aria-hidden /> : null}
        Criar conta
      </button>

      <p className={styles.switch}>
        Já tem conta? <Link href="/entrar">Entrar</Link>
      </p>
    </form>
  );
}
