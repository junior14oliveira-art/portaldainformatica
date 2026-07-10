import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import styles from "../produtos/page.module.css";

export const metadata: Metadata = { title: "Marcas" };

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Marcas</h1>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              <th>Produtos</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td className={styles.productName}>{brand.name}</td>
                <td className={styles.mono}>{brand.slug}</td>
                <td>{brand._count.products}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
