"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { Laptop, Minus, Plus, Trash2 } from "lucide-react";
import { removeCartItemAction, updateCartItemAction } from "@/app/cart-actions";
import styles from "./CartItemRow.module.css";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type CartItemRowProps = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  quantity: number;
  unitPrice: number;
  unitPricePix: number | null;
  lineTotal: number;
};

export function CartItemRow({
  id,
  slug,
  name,
  brand,
  imageUrl,
  imageAlt,
  quantity,
  unitPricePix,
  unitPrice,
  lineTotal,
}: CartItemRowProps) {
  const [isPending, startTransition] = useTransition();

  function changeQuantity(next: number) {
    startTransition(async () => {
      await updateCartItemAction(id, next);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeCartItemAction(id);
    });
  }

  return (
    <div className={styles.row} data-pending={isPending || undefined}>
      <Link href={`/produto/${slug}`} className={styles.media}>
        {imageUrl ? (
          <Image src={imageUrl} alt={imageAlt ?? name} fill sizes="96px" />
        ) : (
          <span className={styles.placeholder}>
            <Laptop size={28} strokeWidth={1.5} aria-hidden />
          </span>
        )}
      </Link>

      <div className={styles.info}>
        {brand ? <span className={styles.brand}>{brand}</span> : null}
        <Link href={`/produto/${slug}`} className={styles.name}>
          {name}
        </Link>
        <span className={styles.unitPrice}>
          {currency.format(unitPricePix ?? unitPrice)} {unitPricePix ? "no PIX" : ""}
        </span>
      </div>

      <div className={styles.quantity}>
        <button
          type="button"
          onClick={() => changeQuantity(quantity - 1)}
          disabled={isPending}
          aria-label="Diminuir quantidade"
        >
          <Minus size={14} strokeWidth={2.25} aria-hidden />
        </button>
        <span>{quantity}</span>
        <button
          type="button"
          onClick={() => changeQuantity(quantity + 1)}
          disabled={isPending}
          aria-label="Aumentar quantidade"
        >
          <Plus size={14} strokeWidth={2.25} aria-hidden />
        </button>
      </div>

      <div className={styles.lineTotal}>{currency.format(lineTotal)}</div>

      <button
        type="button"
        className={styles.remove}
        onClick={handleRemove}
        disabled={isPending}
        aria-label={`Remover ${name} do carrinho`}
      >
        <Trash2 size={16} strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
