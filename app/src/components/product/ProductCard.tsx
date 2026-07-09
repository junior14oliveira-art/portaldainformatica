import Image from "next/image";
import Link from "next/link";
import { Laptop } from "lucide-react";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  slug: string;
  name: string;
  brand?: string | null;
  price: number;
  pricePix?: number | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const INSTALLMENTS = 10;

export function ProductCard({
  slug,
  name,
  brand,
  price,
  pricePix,
  imageUrl,
  imageAlt,
}: ProductCardProps) {
  const installment = price / INSTALLMENTS;
  const pixDiscount =
    pricePix && pricePix < price
      ? Math.round(((price - pricePix) / price) * 100)
      : null;

  return (
    <Link href={`/produto/${slug}`} className={styles.card}>
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
        <span className={styles.condition}>Seminovo</span>
        {pixDiscount ? (
          <span className={styles.discount}>-{pixDiscount}% no PIX</span>
        ) : null}
      </div>

      <div className={styles.body}>
        {brand ? <span className={styles.brand}>{brand}</span> : null}
        <h3 className={styles.name}>{name}</h3>

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
        <p className={styles.installments}>
          ou {currency.format(price)} em até {INSTALLMENTS}x de{" "}
          {currency.format(installment)}
        </p>

        <span className={styles.buyButton}>Comprar</span>
      </div>
    </Link>
  );
}
