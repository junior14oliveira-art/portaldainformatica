"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProductAction } from "@/app/admin/produtos/actions";
import styles from "./DeleteProductButton.module.css";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Desativar o produto "${productName}"? Ele deixará de aparecer na loja.`)) {
      return;
    }
    startTransition(() => deleteProductAction(productId));
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      disabled={isPending}
      aria-label={`Desativar ${productName}`}
    >
      <Trash2 size={16} strokeWidth={2} aria-hidden />
    </button>
  );
}
