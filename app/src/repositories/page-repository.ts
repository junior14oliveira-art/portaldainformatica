import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Acesso a dados das paginas montadas no editor visual (model Page).
export function findAllPages() {
  return prisma.page.findMany({ orderBy: { updatedAt: "desc" } });
}

export function findPageById(id: string) {
  return prisma.page.findUnique({ where: { id } });
}

export function findPublishedPageBySlug(slug: string) {
  return prisma.page.findFirst({ where: { slug, published: true } });
}

type PageData = {
  title: string;
  slug: string;
  data: Prisma.InputJsonValue;
  published: boolean;
  metaTitle?: string;
  metaDescription?: string;
};

export function createPage(data: PageData) {
  return prisma.page.create({ data });
}

export function updatePage(id: string, data: Partial<PageData>) {
  return prisma.page.update({ where: { id }, data });
}

export function deletePage(id: string) {
  return prisma.page.delete({ where: { id } });
}
