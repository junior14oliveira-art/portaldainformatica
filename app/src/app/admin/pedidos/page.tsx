import type { Metadata } from "next";
import Link from "next/link";
import type { OrderStatus } from "@prisma/client";
import { listOrders } from "@/services/admin-order-service";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import styles from "../produtos/page.module.css";

export const metadata: Metadata = { title: "Pedidos" };

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const STATUS_FILTERS: { value: OrderStatus | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "PENDING", label: "Pendente" },
  { value: "PAYMENT_APPROVED", label: "Pago" },
  { value: "PROCESSING", label: "Em preparação" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: OrderStatus }>;
}) {
  const { status } = await searchParams;
  const orders = await listOrders(status || undefined);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Pedidos</h1>
      </div>

      <nav aria-label="Filtrar por status" className={styles.filterNav}>
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value ? `/admin/pedidos?status=${filter.value}` : "/admin/pedidos"}
            className={`${styles.filterPill} ${(status ?? "") === filter.value ? styles.filterPillActive : ""}`}
          >
            {filter.label}
          </Link>
        ))}
      </nav>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link href={`/admin/pedidos/${order.id}`} className={styles.productName}>
                    {order.number}
                  </Link>
                </td>
                <td>
                  {order.user.name}
                  <span className={styles.productBrand}>{order.user.email}</span>
                </td>
                <td>{dateFormatter.format(order.createdAt)}</td>
                <td>
                  <OrderStatusBadge status={order.status} />
                </td>
                <td>{currency.format(Number(order.total))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 ? <p className={styles.empty}>Nenhum pedido encontrado.</p> : null}
      </div>
    </div>
  );
}
