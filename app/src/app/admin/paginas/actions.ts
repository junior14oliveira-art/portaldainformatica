"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin-guard";
import * as pageRepo from "@/repositories/page-repository";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Cria uma pagina em branco e ja abre o editor visual dela.
export async function createPageAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Informe o título da página." };

  const slug = slugify(title) || `pagina-${Date.now()}`;
  const emptyData = { content: [], root: {} } as unknown as Prisma.InputJsonValue;

  try {
    const page = await pageRepo.createPage({ title, slug, data: emptyData, published: false });
    revalidatePath("/admin/paginas");
    redirect(`/admin/paginas/${page.id}`);
  } catch (error) {
    // redirect() lanca uma excecao interna do Next que NAO deve ser tratada
    // como erro — so re-lanca. Qualquer outro erro e slug duplicado.
    if (error && typeof error === "object" && "digest" in error) throw error;
    return { error: "Já existe uma página com esse endereço (slug)." };
  }
}

// Salva o layout de blocos vindo do editor (chamado pelo componente client).
export async function savePageAction(
  id: string,
  data: Prisma.InputJsonValue,
  meta: { title?: string; published?: boolean; metaTitle?: string; metaDescription?: string }
) {
  await requireAdmin();
  const page = await pageRepo.updatePage(id, { data, ...meta });
  revalidatePath("/admin/paginas");
  revalidatePath(`/p/${page.slug}`);
  return { success: true };
}

export async function deletePageAction(id: string) {
  await requireAdmin();
  const page = await pageRepo.findPageById(id);
  await pageRepo.deletePage(id);
  revalidatePath("/admin/paginas");
  if (page) revalidatePath(`/p/${page.slug}`);
}

export async function togglePublishAction(id: string, published: boolean) {
  await requireAdmin();
  const page = await pageRepo.updatePage(id, { published });
  revalidatePath("/admin/paginas");
  revalidatePath(`/p/${page.slug}`);
}
