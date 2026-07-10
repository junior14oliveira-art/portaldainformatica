import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getFormOptions } from "@/services/admin-product-service";
import { updateProductAction } from "@/app/admin/produtos/actions";
import { ProductForm } from "@/components/admin/ProductForm";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "Editar produto" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, [categories, brands]] = await Promise.all([
    getProduct(id),
    getFormOptions(),
  ]);

  if (!product) notFound();

  const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Editar produto</h1>
      </div>
      <ProductForm
        categories={categories}
        brands={brands}
        initialValues={{
          id: product.id,
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          brandId: product.brandId,
          shortDescription: product.shortDescription,
          description: product.description,
          price: Number(product.price),
          pricePix: product.pricePix ? Number(product.pricePix) : null,
          warrantyMonths: product.warrantyMonths,
          active: product.active,
          featured: product.featured,
          imageUrl: mainImage?.url ?? null,
        }}
        action={updateProductAction.bind(null, product.id)}
      />
    </div>
  );
}
