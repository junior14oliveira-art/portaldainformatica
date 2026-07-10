import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listPosts } from "@/services/admin-blog-service";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import styles from "../produtos/page.module.css";

export const metadata: Metadata = { title: "Blog" };

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function AdminBlogPage() {
  const posts = await listPosts();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Blog</h1>
        <Link href="/admin/blog/novo" className={styles.newButton}>
          <Plus size={16} strokeWidth={2.25} aria-hidden />
          Novo artigo
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Status</th>
              <th>Atualizado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <Link href={`/admin/blog/${post.id}`} className={styles.productName}>
                    {post.title}
                  </Link>
                </td>
                <td>{post.authorName ?? "—"}</td>
                <td>
                  <span
                    className={`${styles.status} ${post.published ? styles.statusActive : styles.statusInactive}`}
                  >
                    {post.published ? "Publicado" : "Rascunho"}
                  </span>
                </td>
                <td>{dateFormatter.format(post.updatedAt)}</td>
                <td>
                  <DeletePostButton postId={post.id} postTitle={post.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 ? <p className={styles.empty}>Nenhum artigo ainda.</p> : null}
      </div>
    </div>
  );
}
