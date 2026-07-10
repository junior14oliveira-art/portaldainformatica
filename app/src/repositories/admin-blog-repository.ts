import { prisma } from "@/lib/prisma";

// Blog institucional — mesma logica de "posts" do WordPress, mas com o
// schema BlogPost ja existente (title, slug, content, published, etc).
export function findAllPosts() {
  return prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
}

export function findPostById(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

type PostData = {
  title: string;
  slug: string;
  authorName?: string;
  content: string;
  imageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  published: boolean;
};

export function createPost(data: PostData) {
  return prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug,
      authorName: data.authorName,
      content: data.content,
      imageUrl: data.imageUrl,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      published: data.published,
      publishedAt: data.published ? new Date() : null,
    },
  });
}

export async function updatePost(id: string, data: PostData) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  return prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      authorName: data.authorName,
      content: data.content,
      imageUrl: data.imageUrl,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      published: data.published,
      // So marca a data de publicacao na primeira vez que o post fica publico.
      publishedAt: data.published && !existing?.publishedAt ? new Date() : existing?.publishedAt,
    },
  });
}

export function deletePost(id: string) {
  return prisma.blogPost.delete({ where: { id } });
}
