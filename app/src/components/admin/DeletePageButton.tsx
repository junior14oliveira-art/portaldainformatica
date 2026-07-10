"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletePageAction } from "@/app/admin/paginas/actions";
import styles from "./DeleteProductButton.module.css";

export function DeletePageButton({ pageId, pageTitle }: { pageId: string; pageTitle: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Excluir a página "${pageTitle}"? Essa ação não pode ser desfeita.`)) return;
    startTransition(() => deletePageAction(pageId));
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      disabled={isPending}
      aria-label={`Excluir ${pageTitle}`}
    >
      <Trash2 size={16} strokeWidth={2} aria-hidden />
    </button>
  );
}
