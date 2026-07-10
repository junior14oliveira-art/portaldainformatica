import * as repo from "@/repositories/admin-product-repository";
import type { ProductInput } from "@/schemas/product-schema";

export function listProducts(search?: string) {
  return repo.findProducts(search);
}

export function getProduct(id: string) {
  return repo.findProductById(id);
}

export function getFormOptions() {
  return repo.findCategoriesAndBrands();
}

export function createProduct(input: ProductInput) {
  return repo.createProduct(
    {
      sku: input.sku,
      name: input.name,
      slug: input.slug,
      categoryId: input.categoryId,
      brandId: input.brandId || undefined,
      shortDescription: input.shortDescription || undefined,
      description: input.description || undefined,
      price: input.price,
      pricePix: input.pricePix || undefined,
      warrantyMonths: input.warrantyMonths,
      active: input.active ?? true,
      featured: input.featured ?? false,
    },
    input.imageUrl || undefined
  );
}

export function updateProduct(id: string, input: ProductInput) {
  return repo.updateProduct(
    id,
    {
      sku: input.sku,
      name: input.name,
      slug: input.slug,
      categoryId: input.categoryId,
      brandId: input.brandId || undefined,
      shortDescription: input.shortDescription || undefined,
      description: input.description || undefined,
      price: input.price,
      pricePix: input.pricePix || undefined,
      warrantyMonths: input.warrantyMonths,
      active: input.active ?? true,
      featured: input.featured ?? false,
    },
    input.imageUrl || undefined
  );
}

export function deleteProduct(id: string) {
  return repo.softDeleteProduct(id);
}
