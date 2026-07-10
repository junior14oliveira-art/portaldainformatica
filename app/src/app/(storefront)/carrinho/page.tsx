import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { peekCartSessionId } from "@/lib/cart-session";
import { getCart } from "@/services/cart-service";
import { CartItemRow } from "@/components/cart/CartItemRow";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Carrinho",
  robots: { index: false, follow: false },
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function CartPage() {
  const sessionId = await peekCartSessionId();
  const cart = sessionId ? await getCart(sessionId) : { items: [], itemCount: 0, subtotal: 0 };

  if (cart.items.length === 0) {
    return (
      <div className={`container ${styles.emptyPage}`}>
        <ShoppingBag size={48} strokeWidth={1.25} aria-hidden />
        <h1>Seu carrinho está vazio</h1>
        <p>Explore nosso catálogo e encontre o equipamento certo para sua empresa.</p>
        <Link href="/" className={styles.emptyCta}>
          Ver produtos
          <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>
        Meu carrinho <span>({cart.itemCount} {cart.itemCount === 1 ? "item" : "itens"})</span>
      </h1>

      <div className={styles.layout}>
        <div className={styles.items}>
          {cart.items.map((item) => (
            <CartItemRow
              key={item.id}
              id={item.id}
              slug={item.slug}
              name={item.name}
              brand={item.brand}
              imageUrl={item.imageUrl}
              imageAlt={item.imageAlt}
              quantity={item.quantity}
              unitPrice={item.unitPrice}
              unitPricePix={item.unitPricePix}
              lineTotal={item.lineTotal}
            />
          ))}
        </div>

        <aside className={styles.summary}>
          <h2>Resumo do pedido</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{currency.format(cart.subtotal)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Frete</span>
            <span className={styles.muted}>Calculado no checkout</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>{currency.format(cart.subtotal)}</span>
          </div>
          <Link href="/checkout" className={styles.checkoutButton}>
            Finalizar compra
            <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
          </Link>
          <Link href="/" className={styles.continueLink}>
            Continuar comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
