import type { Metadata } from "next";
import { getFormOptions } from "@/services/admin-product-service";
import { createProductAction } from "@/app/admin/produtos/actions";
import { ProductForm } from "@/components/admin/ProductForm";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "Novo produto" };

export default async function NewProductPage() {
  const [categories, brands] = await getFormOptions();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Novo produto</h1>
      </div>
      <ProductForm categories={categories} brands={brands} action={createProductAction} />
    </div>
  );
}
