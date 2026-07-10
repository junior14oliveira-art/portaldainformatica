import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import styles from "./page.module.css";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Resultados para "${q}"` : "Buscar",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const products = query
    ? await prisma.product.findMany({
        where: {
          active: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { shortDescription: { contains: query, mode: "insensitive" } },
            { sku: { contains: query, mode: "insensitive" } },
            { brand: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: {
          brand: true,
          images: { where: { isMain: true }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>
        {query ? (
          <>
            Resultados para <span>&ldquo;{query}&rdquo;</span>
          </>
        ) : (
          "Buscar produtos"
        )}
      </h1>
      <p className={styles.count}>
        {query
          ? `${products.length} ${products.length === 1 ? "produto encontrado" : "produtos encontrados"}`
          : "Digite algo na busca para ver os produtos disponíveis."}
      </p>

      {query && products.length === 0 ? (
        <div className={styles.empty}>
          <SearchX size={40} strokeWidth={1.5} aria-hidden />
          <p>Não encontramos produtos para essa busca.</p>
          <p className={styles.emptyHint}>
            Tente termos mais gerais, como a marca ou o tipo de equipamento.
          </p>
        </div>
      ) : null}

      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              brand={product.brand?.name}
              price={Number(product.price)}
              pricePix={product.pricePix ? Number(product.pricePix) : null}
              imageUrl={product.images[0]?.url ?? null}
              imageAlt={product.images[0]?.altText ?? null}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
