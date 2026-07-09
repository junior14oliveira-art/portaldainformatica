import Link from "next/link";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  slug: string;
  name: string;
  brand?: string | null;
  price: number;
  pricePix?: number | null;
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductCard({ slug, name, brand, price, pricePix }: ProductCardProps) {
  return (
    <Link href={`/produto/${slug}`} className={styles.card}>
      <div className={styles.image} aria-hidden>
        🖥️
      </div>
      {brand ? <span className={styles.brand}>{brand}</span> : null}
      <h3 className={styles.name}>{name}</h3>
      <div className={styles.prices}>
        <span className={styles.price}>{currency.format(price)}</span>
        {pricePix ? (
          <span className={styles.pix}>{currency.format(pricePix)} no PIX</span>
        ) : null}
      </div>
      <button className={styles.buyButton} type="button">
        Comprar
      </button>
    </Link>
  );
}
