import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import styles from "../auth.module.css";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.card}>
        <h1>Acesse sua conta</h1>
        <p className={styles.subtitle}>
          Entre para acompanhar pedidos, favoritos e propostas de locação.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
