import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StarRating } from "@/components/review/StarRating";
import { ReviewApprovalToggle } from "@/components/admin/ReviewApprovalToggle";
import styles from "../produtos/page.module.css";

export const metadata: Metadata = { title: "Avaliações" };

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } }, product: { select: { name: true, slug: true } } },
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Avaliações</h1>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Cliente</th>
              <th>Nota</th>
              <th>Comentário</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>
                  <Link href={`/produto/${review.product.slug}`} className={styles.productName}>
                    {review.product.name}
                  </Link>
                </td>
                <td>{review.user.name}</td>
                <td>
                  <StarRating value={review.rating} size={13} />
                </td>
                <td className={styles.commentCell}>{review.comment}</td>
                <td>{dateFormatter.format(review.createdAt)}</td>
                <td>
                  <ReviewApprovalToggle reviewId={review.id} approved={review.approved} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 ? <p className={styles.empty}>Nenhuma avaliação ainda.</p> : null}
      </div>
    </div>
  );
}
