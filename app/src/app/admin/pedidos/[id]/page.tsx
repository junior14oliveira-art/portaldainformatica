import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Laptop } from "lucide-react";
import { getOrder } from "@/services/admin-order-service";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Detalhe do pedido" };

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Pedido {order.number}</h1>
          <p className={styles.subtitle}>Criado em {dateFormatter.format(order.createdAt)}</p>
        </div>
        <OrderStatusForm orderId={order.id} currentStatus={order.status} />
      </div>

      <div className={styles.grid}>
        <section className={styles.panel}>
          <h2>Itens</h2>
          {order.items.map((item) => (
            <div key={item.id} className={styles.itemRow}>
              <div className={styles.thumb}>
                {item.product.images[0] ? (
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.images[0].altText ?? item.product.name}
                    fill
                    sizes="48px"
                  />
                ) : (
                  <Laptop size={20} strokeWidth={1.5} aria-hidden />
                )}
              </div>
              <div className={styles.itemInfo}>
                <span>{item.product.name}</span>
                <span className={styles.muted}>
                  {item.quantity}x {currency.format(Number(item.unitPrice))}
                </span>
              </div>
              <span className={styles.itemTotal}>{currency.format(Number(item.total))}</span>
            </div>
          ))}

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>{currency.format(Number(order.subtotal))}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Frete</span>
              <span>{currency.format(Number(order.shippingFee))}</span>
            </div>
            <div className={styles.totalRowFinal}>
              <span>Total</span>
              <span>{currency.format(Number(order.total))}</span>
            </div>
          </div>
        </section>

        <div className={styles.sideColumn}>
          <section className={styles.panel}>
            <h2>Cliente</h2>
            <p className={styles.value}>{order.user.name}</p>
            <p className={styles.muted}>{order.user.email}</p>
            {order.user.phone ? <p className={styles.muted}>{order.user.phone}</p> : null}
          </section>

          {order.address ? (
            <section className={styles.panel}>
              <h2>Endereço de entrega</h2>
              <p className={styles.muted}>
                {order.address.street}, {order.address.number}
                {order.address.complement ? ` - ${order.address.complement}` : ""}
                <br />
                {order.address.neighborhood} — {order.address.city}/{order.address.state}
                <br />
                CEP {order.address.zipCode}
              </p>
            </section>
          ) : null}

          <section className={styles.panel}>
            <h2>Pagamento</h2>
            {order.payments.map((payment) => (
              <div key={payment.id} className={styles.paymentRow}>
                <span>{payment.method}</span>
                <span className={styles.muted}>{payment.status}</span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
