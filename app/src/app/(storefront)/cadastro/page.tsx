import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import styles from "../auth.module.css";

export const metadata: Metadata = {
  title: "Criar conta",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.card}>
        <h1>Criar conta</h1>
        <p className={styles.subtitle}>
          Cadastre-se para comprar ou alugar equipamentos com a Portal One.
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}
