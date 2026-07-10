import * as repo from "@/repositories/admin-blog-repository";
import type { BlogPostInput } from "@/schemas/blog-schema";

export function listPosts() {
  return repo.findAllPosts();
}

export function getPost(id: string) {
  return repo.findPostById(id);
}

export function createPost(input: BlogPostInput) {
  return repo.createPost({
    title: input.title,
    slug: input.slug,
    authorName: input.authorName || undefined,
    content: input.content,
    imageUrl: input.imageUrl || undefined,
    metaTitle: input.metaTitle || undefined,
    metaDescription: input.metaDescription || undefined,
    published: input.published ?? false,
  });
}

export function updatePost(id: string, input: BlogPostInput) {
  return repo.updatePost(id, {
    title: input.title,
    slug: input.slug,
    authorName: input.authorName || undefined,
    content: input.content,
    imageUrl: input.imageUrl || undefined,
    metaTitle: input.metaTitle || undefined,
    metaDescription: input.metaDescription || undefined,
    published: input.published ?? false,
  });
}

export function deletePost(id: string) {
  return repo.deletePost(id);
}
