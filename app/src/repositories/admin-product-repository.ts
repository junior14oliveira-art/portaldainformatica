import { prisma } from "@/lib/prisma";

export function findProducts(search?: string) {
  return prisma.product.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      brand: true,
      category: true,
      images: { where: { isMain: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function findProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
}

export function findCategoriesAndBrands() {
  return Promise.all([
    prisma.category.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);
}

type ProductData = {
  sku: string;
  name: string;
  slug: string;
  categoryId: string;
  brandId?: string;
  shortDescription?: string;
  description?: string;
  price: number;
  pricePix?: number;
  warrantyMonths?: number;
  active?: boolean;
  featured?: boolean;
};

export function createProduct(data: ProductData, imageUrl?: string) {
  return prisma.product.create({
    data: {
      ...data,
      images: imageUrl
        ? { create: { url: imageUrl, isMain: true, altText: data.name } }
        : undefined,
    },
  });
}

export async function updateProduct(id: string, data: ProductData, imageUrl?: string) {
  await prisma.product.update({ where: { id }, data });

  if (imageUrl) {
    const existing = await prisma.productImage.findFirst({ where: { productId: id, isMain: true } });
    if (existing) {
      await prisma.productImage.update({ where: { id: existing.id }, data: { url: imageUrl } });
    } else {
      await prisma.productImage.create({
        data: { productId: id, url: imageUrl, isMain: true, altText: data.name },
      });
    }
  }
}

export function softDeleteProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: { active: false, deletedAt: new Date() },
  });
}
