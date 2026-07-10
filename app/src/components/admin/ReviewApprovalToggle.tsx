"use client";

import { useTransition } from "react";
import { toggleReviewApprovalAction } from "@/app/admin/avaliacoes/actions";
import styles from "./ReviewApprovalToggle.module.css";

export function ReviewApprovalToggle({
  reviewId,
  approved,
}: {
  reviewId: string;
  approved: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => toggleReviewApprovalAction(reviewId, !approved));
  }

  return (
    <button
      type="button"
      className={`${styles.toggle} ${approved ? styles.approved : styles.hidden}`}
      onClick={handleClick}
      disabled={isPending}
    >
      {approved ? "Publicada" : "Oculta"}
    </button>
  );
}
