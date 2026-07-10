import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign, Package, ShoppingCart, Users, ArrowRight } from "lucide-react";
import { getDashboardData } from "@/services/dashboard-service";
import { StatCard } from "@/components/admin/StatCard";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Dashboard" };

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" });

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.statsGrid}>
        <StatCard
          label="Receita (pedidos pagos)"
          value={currency.format(data.revenue)}
          icon={DollarSign}
          accent="success"
        />
        <StatCard label="Total de pedidos" value={String(data.totalOrders)} icon={ShoppingCart} />
        <StatCard
          label="Pedidos pendentes"
          value={String(data.pendingOrders)}
          icon={Package}
          accent="warning"
        />
        <StatCard label="Clientes cadastrados" value={String(data.totalCustomers)} icon={Users} />
      </div>

      <div className={styles.grid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Pedidos recentes</h2>
            <Link href="/admin/pedidos">
              Ver todos <ArrowRight size={14} strokeWidth={2.25} aria-hidden />
            </Link>
          </div>
          {data.recentOrders.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th className={styles.right}>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link href={`/admin/pedidos/${order.id}`} className={styles.orderLink}>
                        {order.number}
                      </Link>
                    </td>
                    <td>{order.user.name || order.user.email}</td>
                    <td>{dateFormatter.format(order.createdAt)}</td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className={styles.right}>{currency.format(Number(order.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.empty}>Nenhum pedido ainda.</p>
          )}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Mais vendidos</h2>
          </div>
          {data.topProducts.length > 0 ? (
            <ul className={styles.topList}>
              {data.topProducts.map((product, index) => (
                <li key={product.id} className={styles.topItem}>
                  <span className={styles.topRank}>{index + 1}</span>
                  <div className={styles.topInfo}>
                    <Link href={`/produto/${product.slug}`} className={styles.topName}>
                      {product.name}
                    </Link>
                    <span className={styles.topMeta}>
                      {product.quantitySold} vendido(s) · {currency.format(product.revenue)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>Ainda sem vendas registradas.</p>
          )}
        </section>
      </div>
    </div>
  );
}
