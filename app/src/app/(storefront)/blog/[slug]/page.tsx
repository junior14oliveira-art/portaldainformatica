import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/constants/company";
import styles from "./page.module.css";

type PageProps = { params: Promise<{ slug: string }> };

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) return {};

  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_URL}/blog/${post.slug}`,
      images: post.imageUrl ? [{ url: post.imageUrl }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.imageUrl ? [post.imageUrl] : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.authorName ? { "@type": "Person", name: post.authorName } : undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <article className={`container ${styles.page}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
        <Link href="/">Início</Link>
        <ChevronRight size={14} strokeWidth={2} aria-hidden />
        <Link href="/blog">Blog</Link>
        <ChevronRight size={14} strokeWidth={2} aria-hidden />
        <span aria-current="page">{post.title}</span>
      </nav>

      <h1 className={styles.title}>{post.title}</h1>
      <p className={styles.meta}>
        {post.authorName ? `${post.authorName} · ` : ""}
        {post.publishedAt ? dateFormatter.format(post.publishedAt) : ""}
      </p>

      {post.imageUrl ? (
        <div className={styles.media}>
          <Image src={post.imageUrl} alt={post.title} fill sizes="(max-width: 900px) 100vw, 800px" priority />
        </div>
      ) : null}

      <div className={styles.content}>
        {post.content.split("\n").map((paragraph, index) =>
          paragraph.trim() ? <p key={index}>{paragraph}</p> : null
        )}
      </div>
    </article>
  );
}
