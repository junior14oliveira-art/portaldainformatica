"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletePostAction } from "@/app/admin/blog/actions";
import styles from "./DeleteProductButton.module.css";

export function DeletePostButton({ postId, postTitle }: { postId: string; postTitle: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Excluir o artigo "${postTitle}"? Essa ação não pode ser desfeita.`)) return;
    startTransition(() => deletePostAction(postId));
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      disabled={isPending}
      aria-label={`Excluir ${postTitle}`}
    >
      <Trash2 size={16} strokeWidth={2} aria-hidden />
    </button>
  );
}
