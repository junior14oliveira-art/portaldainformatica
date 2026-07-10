import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { findAllPages } from "@/repositories/page-repository";
import { CreatePageForm } from "@/components/admin/CreatePageForm";
import { DeletePageButton } from "@/components/admin/DeletePageButton";
import styles from "../produtos/page.module.css";

export const metadata: Metadata = { title: "Páginas (Editor visual)" };

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function AdminPagesPage() {
  const pages = await findAllPages();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Páginas (Editor visual)</h1>
      </div>

      <CreatePageForm />

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Endereço</th>
              <th>Status</th>
              <th>Atualizada</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id}>
                <td>
                  <Link href={`/admin/paginas/${page.id}`} className={styles.productName}>
                    {page.title}
                  </Link>
                </td>
                <td className={styles.mono}>
                  /p/{page.slug}
                  {page.published ? (
                    <Link href={`/p/${page.slug}`} target="_blank" style={{ marginLeft: 8 }}>
                      <ExternalLink size={13} aria-hidden />
                    </Link>
                  ) : null}
                </td>
                <td>
                  <span
                    className={`${styles.status} ${page.published ? styles.statusActive : styles.statusInactive}`}
                  >
                    {page.published ? "Publicada" : "Rascunho"}
                  </span>
                </td>
                <td>{dateFormatter.format(page.updatedAt)}</td>
                <td>
                  <DeletePageButton pageId={page.id} pageTitle={page.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages.length === 0 ? (
          <p className={styles.empty}>
            Nenhuma página criada ainda. Crie uma acima para abrir o editor visual.
          </p>
        ) : null}
      </div>
    </div>
  );
}
