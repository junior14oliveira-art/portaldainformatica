"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LogoutButton } from "@/components/auth/LogoutButton";
import topbarStyles from "@/components/admin/AdminTopbar.module.css";
import styles from "./AdminShell.module.css";

type AdminShellProps = {
  userName: string;
  userEmail: string;
  children: React.ReactNode;
};

// Em telas estreitas a sidebar vira um painel deslizante (off-canvas) em
// vez de ficar sempre visivel ao lado do conteudo — sem isso, ela
// empurrava o conteudo pra fora da tela em celular/tablet.
export function AdminShell({ userName, userEmail, children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className={styles.shell}>
      <div
        className={`${styles.sidebarWrapper} ${mobileOpen ? styles.sidebarOpen : ""}`}
      >
        <AdminSidebar />
      </div>

      {mobileOpen ? (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className={styles.main}>
        <header className={topbarStyles.topbar}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
          <div />
          <div className={topbarStyles.user}>
            <div className={topbarStyles.userInfo}>
              <span className={topbarStyles.userName}>{userName}</span>
              <span className={topbarStyles.userEmail}>{userEmail}</span>
            </div>
            <div className={topbarStyles.avatar}>{initials}</div>
            <LogoutButton className={topbarStyles.logoutButton} compact />
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
