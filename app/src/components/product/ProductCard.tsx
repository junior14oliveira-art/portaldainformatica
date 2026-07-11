import Image from "next/image";
import Link from "next/link";
import { Laptop } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { WishlistButton } from "@/components/product/WishlistButton";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  id: string;
  slug: string;
  name: string;
  brand?: string | null;
  price: number;
  pricePix?: number | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  inWishlist?: boolean;
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductCard({
  id,
  slug,
  name,
  brand,
  price,
  pricePix,
  imageUrl,
  imageAlt,
  inWishlist,
}: ProductCardProps) {
  const pixDiscount =
    pricePix && pricePix < price
      ? Math.round(((price - pricePix) / price) * 100)
      : null;

  return (
    <div className={styles.card}>
      <div className={styles.media}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
            className={styles.photo}
          />
        ) : (
          <span className={styles.placeholder}>
            <Laptop size={40} strokeWidth={1.5} aria-hidden />
          </span>
        )}
        <Link
          href={`/produto/${slug}`}
          className={styles.mediaLink}
          aria-label={name}
        />
        {pixDiscount ? (
          <span className={styles.discount}>-{pixDiscount}% no PIX</span>
        ) : null}
        <WishlistButton productId={id} initialInWishlist={inWishlist} />
      </div>

      <div className={styles.body}>
        {brand ? <span className={styles.brand}>{brand}</span> : null}
        <Link href={`/produto/${slug}`} className={styles.nameLink}>
          <h3 className={styles.name}>{name}</h3>
        </Link>

        <div className={styles.prices}>
          {pricePix ? (
            <>
              <span className={styles.pix}>{currency.format(pricePix)}</span>
              <span className={styles.pixLabel}>no PIX</span>
            </>
          ) : (
            <span className={styles.pix}>{currency.format(price)}</span>
          )}
        </div>

        <AddToCartButton productId={id} className={styles.buyButton} />
      </div>
    </div>
  );
}
