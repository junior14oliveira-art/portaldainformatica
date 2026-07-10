import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/constants/company";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Dicas e novidades sobre tecnologia corporativa, notebooks, computadores e servidores da Portal One Informática.",
  alternates: { canonical: "/blog" },
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Blog</h1>
      <p className={styles.subtitle}>
        Conteúdo sobre tecnologia corporativa para ajudar sua empresa a decidir melhor.
      </p>

      {posts.length > 0 ? (
        <div className={styles.grid}>
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className={styles.card}>
              <div className={styles.media}>
                {post.imageUrl ? (
                  <Image src={post.imageUrl} alt={post.title} fill sizes="(max-width: 640px) 100vw, 33vw" />
                ) : (
                  <FileText size={32} strokeWidth={1.5} aria-hidden />
                )}
              </div>
              <div className={styles.cardBody}>
                <span className={styles.date}>
                  {post.publishedAt ? dateFormatter.format(post.publishedAt) : ""}
                </span>
                <h2>{post.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Nenhum artigo publicado ainda.</p>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Blog Portal One Informática",
            url: `${SITE_URL}/blog`,
          }),
        }}
      />
    </div>
  );
}
