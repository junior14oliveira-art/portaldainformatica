import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRoleSelect } from "@/components/admin/UserRoleSelect";
import styles from "../produtos/page.module.css";

export const metadata: Metadata = { title: "Usuários" };

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const users = await prisma.user.findMany({
    where: { role: { not: "CUSTOMER" } },
    orderBy: { createdAt: "asc" },
  });

  const isAdmin = session?.user.role === "ADMIN";

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Usuários da equipe</h1>
      </div>
      {!isAdmin ? (
        <p className={styles.empty}>
          Apenas administradores podem alterar papéis de usuário nesta tela.
        </p>
      ) : null}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Papel</th>
              <th>Desde</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className={styles.productName}>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <UserRoleSelect
                    userId={user.id}
                    currentRole={user.role}
                    disabled={!isAdmin || user.id === session?.user.id}
                  />
                </td>
                <td>{dateFormatter.format(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 ? <p className={styles.empty}>Nenhum usuário da equipe ainda.</p> : null}
      </div>
    </div>
  );
}
