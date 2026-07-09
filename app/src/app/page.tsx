import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import styles from "./page.module.css";

const TRUST_ITEMS = [
  {
    icon: "📦",
    title: "Suporte Especializado",
    text: "Sem complicações e sem custos adicionais",
  },
  {
    icon: "🚚",
    title: "Entrega Nacional",
    text: "Frete seguro para todo o Brasil",
  },
  {
    icon: "🛡️",
    title: "Site 100% Seguro",
    text: "Compre ou alugue com total segurança",
  },
];

export default async function Home() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      take: 6,
    }),
    prisma.product.findMany({
      where: { active: true },
      include: { brand: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div>
            <p className={styles.heroEyebrow}>Computadores Corporativos</p>
            <h1 className={styles.heroTitle}>
              Equipamentos revisados, prontos para o seu escritório
            </h1>
            <p className={styles.heroSubtitle}>
              Desktops e notebooks Dell, HP e Lenovo com garantia e nota
              fiscal.
            </p>
            <Link href="/categoria/notebooks" className={styles.heroCta}>
              Ver Notebooks
            </Link>
          </div>
        </div>
      </section>

      <section className={`container ${styles.trust}`}>
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className={styles.trustItem}>
            <span className={styles.trustIcon}>{item.icon}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <h2>O que você procura hoje?</h2>
          <Link href="/categorias">Ver todas as categorias →</Link>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.slug}`}
              className={styles.categoryItem}
            >
              <span className={styles.categoryCircle} aria-hidden>
                💻
              </span>
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <h2>Recomendados</h2>
        </div>
        {products.length > 0 ? (
          <div className={styles.productGrid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                brand={product.brand?.name}
                price={Number(product.price)}
                pricePix={product.pricePix ? Number(product.pricePix) : null}
              />
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>Nenhum produto cadastrado ainda.</p>
        )}
      </section>
    </div>
  );
}
