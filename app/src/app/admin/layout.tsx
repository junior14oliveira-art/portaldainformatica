import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: {
    default: "Painel Admin",
    template: "%s | Admin Portal One",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdmin();

  return (
    <div className={styles.shell}>
      <AdminSidebar />
      <div className={styles.main}>
        <AdminTopbar userName={session.user.name} userEmail={session.user.email} />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
