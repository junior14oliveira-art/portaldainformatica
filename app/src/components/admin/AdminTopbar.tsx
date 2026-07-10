import { LogoutButton } from "@/components/auth/LogoutButton";
import styles from "./AdminTopbar.module.css";

type AdminTopbarProps = {
  userName: string;
  userEmail: string;
};

export function AdminTopbar({ userName, userEmail }: AdminTopbarProps) {
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className={styles.topbar}>
      <div />
      <div className={styles.user}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{userName}</span>
          <span className={styles.userEmail}>{userEmail}</span>
        </div>
        <div className={styles.avatar}>{initials}</div>
        <LogoutButton className={styles.logoutButton} compact />
      </div>
    </header>
  );
}
