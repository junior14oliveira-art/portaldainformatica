"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { productSchema } from "@/schemas/product-schema";
import * as adminProductService from "@/services/admin-product-service";

function parseFormData(formData: FormData) {
  return productSchema.safeParse({
    sku: formData.get("sku"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId"),
    brandId: formData.get("brandId") || undefined,
    shortDescription: formData.get("shortDescription") || undefined,
    description: formData.get("description") || undefined,
    price: formData.get("price"),
    pricePix: formData.get("pricePix") || undefined,
    warrantyMonths: formData.get("warrantyMonths") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    active: formData.get("active") === "on",
    featured: formData.get("featured") === "on",
  });
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await adminProductService.createProduct(parsed.data);
  } catch {
    return { error: "Já existe um produto com esse SKU ou slug." };
  }

  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await adminProductService.updateProduct(id, parsed.data);
  } catch {
    return { error: "Já existe um produto com esse SKU ou slug." };
  }

  revalidatePath("/admin/produtos");
  revalidatePath(`/produto/${parsed.data.slug}`);
  redirect("/admin/produtos");
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await adminProductService.deleteProduct(id);
  revalidatePath("/admin/produtos");
}
