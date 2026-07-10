import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { peekCartSessionId } from "@/lib/cart-session";
import { getCart } from "@/services/cart-service";
import { getUserAddresses } from "@/services/address-service";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/entrar?callbackURL=/checkout");
  }

  const sessionId = await peekCartSessionId();
  const cart = sessionId ? await getCart(sessionId) : { items: [], itemCount: 0, subtotal: 0 };

  if (cart.items.length === 0) {
    redirect("/carrinho");
  }

  const addresses = await getUserAddresses(session.user.id);

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Finalizar compra</h1>
      <CheckoutFlow
        addresses={addresses.map((a) => ({
          id: a.id,
          street: a.street,
          number: a.number,
          complement: a.complement,
          neighborhood: a.neighborhood,
          city: a.city,
          state: a.state,
          zipCode: a.zipCode,
          isDefault: a.isDefault,
        }))}
        cart={cart}
      />
    </div>
  );
}
