import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Laptop, Plus } from "lucide-react";
import { listProducts } from "@/services/admin-product-service";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Produtos" };

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await listProducts(q);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Produtos</h1>
        <Link href="/admin/produtos/novo" className={styles.newButton}>
          <Plus size={16} strokeWidth={2.25} aria-hidden />
          Novo produto
        </Link>
      </div>

      <form className={styles.searchForm}>
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome ou SKU..."
        />
      </form>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Produto</th>
              <th>SKU</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className={styles.thumb}>
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].altText ?? product.name}
                        fill
                        sizes="40px"
                      />
                    ) : (
                      <Laptop size={18} strokeWidth={1.5} aria-hidden />
                    )}
                  </div>
                </td>
                <td>
                  <Link href={`/admin/produtos/${product.id}`} className={styles.productName}>
                    {product.name}
                  </Link>
                  <span className={styles.productBrand}>{product.brand?.name}</span>
                </td>
                <td className={styles.mono}>{product.sku}</td>
                <td>{product.category.name}</td>
                <td>{currency.format(Number(product.price))}</td>
                <td>
                  <span
                    className={`${styles.status} ${product.active ? styles.statusActive : styles.statusInactive}`}
                  >
                    {product.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td>
                  <DeleteProductButton productId={product.id} productName={product.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 ? (
          <p className={styles.empty}>Nenhum produto encontrado.</p>
        ) : null}
      </div>
    </div>
  );
}
