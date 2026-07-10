"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { blogPostSchema } from "@/schemas/blog-schema";
import * as adminBlogService from "@/services/admin-blog-service";

function parseFormData(formData: FormData) {
  return blogPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    authorName: formData.get("authorName") || undefined,
    content: formData.get("content"),
    imageUrl: formData.get("imageUrl") || undefined,
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
    published: formData.get("published") === "on",
  });
}

export async function createPostAction(formData: FormData) {
  await requireAdmin();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await adminBlogService.createPost(parsed.data);
  } catch {
    return { error: "Já existe um artigo com esse slug." };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updatePostAction(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await adminBlogService.updatePost(id, parsed.data);
  } catch {
    return { error: "Já existe um artigo com esse slug." };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  redirect("/admin/blog");
}

export async function deletePostAction(id: string) {
  await requireAdmin();
  await adminBlogService.deletePost(id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
