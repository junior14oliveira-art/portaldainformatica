import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { CheckCircle2, Clock, Laptop } from "lucide-react";
import { auth } from "@/lib/auth";
import { getOrder } from "@/services/order-service";
import { SimulatePaymentButton } from "@/components/checkout/SimulatePaymentButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  robots: { index: false, follow: false },
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/entrar?callbackURL=/pedido/${id}`);

  const order = await getOrder(id, session.user.id);
  if (!order) notFound();

  const isApproved = order.status !== "PENDING";

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.status}>
        {isApproved ? (
          <CheckCircle2 size={48} strokeWidth={1.5} className={styles.approvedIcon} aria-hidden />
        ) : (
          <Clock size={48} strokeWidth={1.5} className={styles.pendingIcon} aria-hidden />
        )}
        <h1>{isApproved ? "Pedido confirmado!" : "Aguardando pagamento"}</h1>
        <p>
          Pedido <strong>{order.number}</strong>
        </p>
        {!isApproved ? (
          <SimulatePaymentButton orderId={order.id} />
        ) : (
          <p className={styles.approvedText}>
            Você receberá atualizações por e-mail sobre o envio.
          </p>
        )}
      </div>

      <div className={styles.grid}>
        <section className={styles.items}>
          <h2>Itens do pedido</h2>
          {order.items.map((item) => (
            <div key={item.id} className={styles.itemRow}>
              <div className={styles.itemMedia}>
                {item.product.images[0] ? (
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.images[0].altText ?? item.product.name}
                    fill
                    sizes="64px"
                  />
                ) : (
                  <Laptop size={24} strokeWidth={1.5} aria-hidden />
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
        </section>

        <aside className={styles.summary}>
          <h2>Resumo</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{currency.format(Number(order.subtotal))}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Frete</span>
            <span>{currency.format(Number(order.shippingFee))}</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>{currency.format(Number(order.total))}</span>
          </div>

          {order.address ? (
            <div className={styles.address}>
              <h3>Endereço de entrega</h3>
              <p>
                {order.address.street}, {order.address.number}
                {order.address.complement ? ` - ${order.address.complement}` : ""}
                <br />
                {order.address.neighborhood} — {order.address.city}/{order.address.state}
                <br />
                CEP {order.address.zipCode}
              </p>
            </div>
          ) : null}

          <Link href="/" className={styles.continueLink}>
            Voltar para a loja
          </Link>
        </aside>
      </div>
    </div>
  );
}
