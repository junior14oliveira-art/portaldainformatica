import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Heart } from "lucide-react";
import { auth } from "@/lib/auth";
import { getWishlist } from "@/services/wishlist-service";
import { ProductCard } from "@/components/product/ProductCard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Meus favoritos",
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/entrar?callbackURL=/favoritos");
  }

  const items = await getWishlist(session.user.id);

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Meus favoritos</h1>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <Heart size={40} strokeWidth={1.5} aria-hidden />
          <p>Você ainda não favoritou nenhum produto.</p>
          <Link href="/" className={styles.emptyCta}>
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <ProductCard
              key={item.id}
              id={item.product.id}
              slug={item.product.slug}
              name={item.product.name}
              brand={item.product.brand?.name}
              price={Number(item.product.price)}
              pricePix={item.product.pricePix ? Number(item.product.pricePix) : null}
              imageUrl={item.product.images[0]?.url ?? null}
              imageAlt={item.product.images[0]?.altText ?? null}
              inWishlist
            />
          ))}
        </div>
      )}
    </div>
  );
}
