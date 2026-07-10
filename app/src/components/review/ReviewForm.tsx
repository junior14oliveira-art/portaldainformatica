"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { submitReviewAction } from "@/app/produto/[slug]/actions";
import styles from "./ReviewForm.module.css";

type ReviewFormProps = {
  productId: string;
  slug: string;
};

export function ReviewForm({ productId, slug }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    if (rating === 0) {
      setError("Escolha uma nota de 1 a 5 estrelas.");
      return;
    }
    formData.set("rating", String(rating));
    formData.set("comment", comment);

    startTransition(async () => {
      const result = await submitReviewAction(productId, slug, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      setComment("");
      setRating(0);
    });
  }

  if (success) {
    return (
      <p className={styles.success}>
        Obrigado pela sua avaliação! Ela já está publicada.
      </p>
    );
  }

  return (
    <form action={handleSubmit} className={styles.form}>
      <div className={styles.starPicker} role="radiogroup" aria-label="Sua nota">
        {Array.from({ length: 5 }, (_, i) => {
          const value = i + 1;
          const active = value <= (hoverRating || rating);
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} estrela${value > 1 ? "s" : ""}`}
              className={styles.starButton}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(value)}
            >
              <Star
                size={26}
                strokeWidth={1.5}
                fill={active ? "currentColor" : "none"}
                className={active ? styles.filled : styles.empty}
              />
            </button>
          );
        })}
      </div>

      <textarea
        name="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Conte como foi sua experiência com o produto (opcional)"
        className={styles.textarea}
        rows={3}
        maxLength={1000}
      />

      {error ? <p className={styles.error}>{error}</p> : null}

      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}
