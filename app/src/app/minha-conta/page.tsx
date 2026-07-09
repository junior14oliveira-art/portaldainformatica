import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Minha Conta",
  robots: { index: false, follow: false },
};

export default async function MyAccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/entrar");
  }

  const { user } = session;

  return (
    <div className={`container ${styles.page}`}>
      <h1>Minha Conta</h1>
      <div className={styles.card}>
        <p className={styles.greeting}>
          Olá, <strong>{user.name || user.email}</strong>
        </p>
        <p className={styles.email}>{user.email}</p>
        <LogoutButton />
      </div>
    </div>
  );
}
