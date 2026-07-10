import type { Metadata } from "next";
import Link from "next/link";
import { listAllQuestions } from "@/services/question-service";
import { AnswerQuestionForm } from "@/components/admin/AnswerQuestionForm";
import styles from "../produtos/page.module.css";

export const metadata: Metadata = { title: "Perguntas" };

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function AdminQuestionsPage() {
  const questions = await listAllQuestions();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Perguntas de produtos</h1>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Cliente</th>
              <th>Pergunta / Resposta</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td>
                  <Link href={`/produto/${q.product.slug}`} className={styles.productName}>
                    {q.product.name}
                  </Link>
                </td>
                <td>{q.user.name}</td>
                <td className={styles.questionCell}>
                  <p>{q.question}</p>
                  {q.answer ? (
                    <p className={styles.mono}>Resp.: {q.answer}</p>
                  ) : (
                    <AnswerQuestionForm questionId={q.id} />
                  )}
                </td>
                <td>{dateFormatter.format(q.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {questions.length === 0 ? <p className={styles.empty}>Nenhuma pergunta ainda.</p> : null}
      </div>
    </div>
  );
}
