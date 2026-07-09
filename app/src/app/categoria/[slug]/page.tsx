import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCategoryIcon } from "@/lib/category-icons";
import { ProductCard } from "@/components/product/ProductCard";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ marca?: string; ordem?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return {
    title: category.name,
    description:
      category.description ??
      `${category.name} corporativos seminovos com garantia e nota fiscal na Portal One Informática.`,
  };
}

const ORDER_OPTIONS = [
  { value: "recentes", label: "Mais recentes" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
] as const;

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const [{ slug }, { marca, ordem }] = await Promise.all([params, searchParams]);

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category || !category.active) notFound();

  const orderBy =
    ordem === "menor-preco"
      ? { price: "asc" as const }
      : ordem === "maior-preco"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const [products, brands] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: category.id,
        active: true,
        ...(marca ? { brand: { slug: marca } } : {}),
      },
      include: {
        brand: true,
        images: { where: { isMain: true }, take: 1 },
      },
      orderBy,
    }),
    prisma.brand.findMany({
      where: {
        products: { some: { categoryId: category.id, active: true } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const Icon = getCategoryIcon(category.slug);
  const baseUrl = `/categoria/${category.slug}`;

  return (
    <div className={styles.page}>
      <section className={styles.banner}>
        <div className={`container ${styles.bannerInner}`}>
          <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
            <Link href="/">Início</Link>
            <ChevronRight size={14} strokeWidth={2} aria-hidden />
            <span aria-current="page">{category.name}</span>
          </nav>
          <div className={styles.bannerTitle}>
            <span className={styles.bannerIcon}>
              <Icon size={28} strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <h1>{category.name}</h1>
              <p>
                {products.length}{" "}
                {products.length === 1 ? "produto disponível" : "produtos disponíveis"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className={`container ${styles.content}`}>
        <aside className={styles.sidebar}>
          <h2>Filtros</h2>

          <div className={styles.filterGroup}>
            <h3>Marca</h3>
            <ul>
              <li>
                <Link
                  href={baseUrl}
                  className={!marca ? styles.filterActive : undefined}
                >
                  Todas
                </Link>
              </li>
              {brands.map((brand) => (
                <li key={brand.id}>
                  <Link
                    href={`${baseUrl}?marca=${brand.slug}${ordem ? `&ordem=${ordem}` : ""}`}
                    className={marca === brand.slug ? styles.filterActive : undefined}
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className={styles.results}>
          <div className={styles.resultsHeader}>
            <p>
              Exibindo {products.length}{" "}
              {products.length === 1 ? "resultado" : "resultados"}
            </p>
            <nav className={styles.orderNav} aria-label="Ordenação">
              {ORDER_OPTIONS.map((option) => (
                <Link
                  key={option.value}
                  href={`${baseUrl}?${marca ? `marca=${marca}&` : ""}ordem=${option.value}`}
                  className={
                    (ordem ?? "recentes") === option.value
                      ? styles.orderActive
                      : undefined
                  }
                >
                  {option.label}
                </Link>
              ))}
            </nav>
          </div>

          {products.length > 0 ? (
            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
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
          ) : (
            <div className={styles.empty}>
              <p>Nenhum produto encontrado nesta categoria.</p>
              <Link href="/">Voltar para a página inicial</Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
