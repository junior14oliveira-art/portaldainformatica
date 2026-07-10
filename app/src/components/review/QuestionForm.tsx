"use client";

import { useState, useTransition } from "react";
import { askQuestionAction } from "@/app/(storefront)/produto/[slug]/actions";
import styles from "./ReviewForm.module.css";

export function QuestionForm({ productId, slug }: { productId: string; slug: string }) {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await askQuestionAction(productId, slug, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      setQuestion("");
    });
  }

  if (success) {
    return (
      <p className={styles.success}>
        Sua pergunta foi enviada! Assim que respondermos, ela aparece aqui.
      </p>
    );
  }

  return (
    <form action={handleSubmit} className={styles.form}>
      <textarea
        name="question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Tem alguma dúvida sobre este produto? Pergunte aqui."
        className={styles.textarea}
        rows={2}
        maxLength={500}
      />
      {error ? <p className={styles.error}>{error}</p> : null}
      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? "Enviando..." : "Enviar pergunta"}
      </button>
    </form>
  );
}
