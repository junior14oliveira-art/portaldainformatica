import type { LucideIcon } from "lucide-react";
import styles from "./StatCard.module.css";

type StatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "primary" | "warning" | "success";
};

export function StatCard({ label, value, icon: Icon, accent = "primary" }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={`${styles.iconWrapper} ${styles[accent]}`}>
        <Icon size={20} strokeWidth={2} aria-hidden />
      </div>
      <div>
        <p className={styles.value}>{value}</p>
        <p className={styles.label}>{label}</p>
      </div>
    </div>
  );
}
