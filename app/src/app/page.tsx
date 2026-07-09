import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeadphonesIcon, ShieldCheck, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCategoryIcon } from "@/lib/category-icons";
import { ProductCard } from "@/components/product/ProductCard";
import styles from "./page.module.css";

const TRUST_ITEMS = [
  {
    icon: HeadphonesIcon,
    title: "Suporte especializado",
    text: "Sem complicações e sem custos adicionais",
  },
  {
    icon: Truck,
    title: "Entrega nacional",
    text: "Frete seguro para todo o Brasil",
  },
  {
    icon: ShieldCheck,
    title: "Site 100% seguro",
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
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>
              Equipamentos corporativos revisados, prontos para o seu
              escritório
            </h1>
            <p className={styles.heroSubtitle}>
              Desktops e notebooks Dell, HP e Lenovo seminovos, com garantia e
              nota fiscal — para empresas que precisam de custo-benefício sem
              abrir mão de confiabilidade.
            </p>
            <Link href="/categoria/notebooks" className={styles.heroCta}>
              Ver notebooks
              <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
            </Link>
          </div>
          <div className={styles.heroMedia}>
            <Image
              src="https://images.unsplash.com/photo-1535957998253-26ae1ef29506?auto=format&fit=crop&w=1200&q=80"
              alt="Notebook corporativo aberto sobre uma mesa de escritório moderno"
              fill
              sizes="(max-width: 900px) 100vw, 480px"
              priority
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      <section className={`container ${styles.trust}`}>
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className={styles.trustItem}>
            <item.icon size={22} strokeWidth={2} className={styles.trustIcon} aria-hidden />
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
          <Link href="/categorias" className={styles.sectionLink}>
            Ver todas as categorias
            <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
          </Link>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            return (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className={styles.categoryItem}
              >
                <span className={styles.categoryCircle}>
                  <Icon size={28} strokeWidth={1.75} aria-hidden />
                </span>
                <span>{category.name}</span>
              </Link>
            );
          })}
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
