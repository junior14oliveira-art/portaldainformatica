"use client";

import { useState, useTransition } from "react";
import { answerQuestionAction } from "@/app/admin/perguntas/actions";
import styles from "./AnswerQuestionForm.module.css";

export function AnswerQuestionForm({ questionId }: { questionId: string }) {
  const [answer, setAnswer] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await answerQuestionAction(questionId, formData);
      setAnswer("");
    });
  }

  return (
    <form action={handleSubmit} className={styles.form}>
      <input
        name="answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Escreva a resposta..."
        className={styles.input}
        required
      />
      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? "..." : "Responder"}
      </button>
    </form>
  );
}
