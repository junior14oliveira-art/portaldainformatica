import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import styles from "../produtos/page.module.css";

export const metadata: Metadata = { title: "Clientes" };

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Clientes</h1>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Pedidos</th>
              <th>Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className={styles.productName}>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer._count.orders}</td>
                <td>{dateFormatter.format(customer.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 ? (
          <p className={styles.empty}>Nenhum cliente cadastrado ainda.</p>
        ) : null}
      </div>
    </div>
  );
}
