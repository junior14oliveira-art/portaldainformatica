import type { Metadata } from "next";
import { createPostAction } from "@/app/admin/blog/actions";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import styles from "../../produtos/page.module.css";

export const metadata: Metadata = { title: "Novo artigo" };

export default function NewBlogPostPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Novo artigo</h1>
      </div>
      <BlogPostForm action={createPostAction} />
    </div>
  );
}
