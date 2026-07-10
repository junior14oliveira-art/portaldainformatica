"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { loginSchema, type LoginInput } from "@/schemas/auth-schema";
import styles from "./AuthForm.module.css";

type LoginFormProps = {
  callbackURL?: string;
};

export function LoginForm({ callbackURL = "/minha-conta" }: LoginFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError("E-mail ou senha inválidos.");
      return;
    }

    router.push(callbackURL);
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
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
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password ? (
          <span className={styles.error}>{errors.password.message}</span>
        ) : null}
      </div>

      {serverError ? <p className={styles.serverError}>{serverError}</p> : null}

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? <Loader2 size={18} className="spin" aria-hidden /> : null}
        Entrar
      </button>

      <p className={styles.switch}>
        Ainda não tem conta? <Link href="/cadastro">Cadastre-se</Link>
      </p>
    </form>
  );
}
