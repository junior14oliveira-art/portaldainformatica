import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/services/admin-blog-service";
import { updatePostAction } from "@/app/admin/blog/actions";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import styles from "../../produtos/page.module.css";

export const metadata: Metadata = { title: "Editar artigo" };

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Editar artigo</h1>
      </div>
      <BlogPostForm
        initialValues={{
          title: post.title,
          slug: post.slug,
          authorName: post.authorName,
          content: post.content,
          imageUrl: post.imageUrl,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          published: post.published,
        }}
        action={updatePostAction.bind(null, post.id)}
      />
    </div>
  );
}
