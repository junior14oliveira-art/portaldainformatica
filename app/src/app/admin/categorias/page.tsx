import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import styles from "../produtos/page.module.css";

export const metadata: Metadata = { title: "Categorias" };

// Listagem simples por enquanto (as categorias ja vem populadas pelo seed).
// Criar/editar categoria fica para uma proxima etapa, quando fizer sentido
// dar ao admin controle total sobre a arvore de categorias.
export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Categorias</h1>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              <th>Produtos</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className={styles.productName}>{category.name}</td>
                <td className={styles.mono}>{category.slug}</td>
                <td>{category._count.products}</td>
                <td>
                  <span
                    className={`${styles.status} ${category.active ? styles.statusActive : styles.statusInactive}`}
                  >
                    {category.active ? "Ativa" : "Inativa"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
