"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import styles from "./AuthForm.module.css";

type LogoutButtonProps = {
  className?: string;
  compact?: boolean;
};

export function LogoutButton({ className, compact }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      className={className ?? styles.submit}
      onClick={handleLogout}
      aria-label="Sair da conta"
    >
      <LogOut size={16} strokeWidth={2.25} aria-hidden />
      {compact ? null : "Sair da conta"}
    </button>
  );
}
