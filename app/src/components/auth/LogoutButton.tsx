"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import styles from "./AuthForm.module.css";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" className={styles.submit} onClick={handleLogout}>
      <LogOut size={16} strokeWidth={2.25} aria-hidden />
      Sair da conta
    </button>
  );
}
