import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  FileText,
  Headset,
  MessageCircle,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCategoryIcon } from "@/lib/category-icons";
import { ProductCard } from "@/components/product/ProductCard";
import styles from "./page.module.css";

const WHATSAPP_URL =
  "https://wa.me/5511941470245?text=Ol%C3%A1!%20Quero%20falar%20com%20um%20especialista.";

const HERO_CHIPS = [
  { icon: BadgeCheck, label: "Garantia de 6 meses" },
  { icon: FileText, label: "Nota fiscal" },
  { icon: Truck, label: "Envio para todo o Brasil" },
];

const TRUST_ITEMS = [
  {
    icon: Headset,
    title: "Suporte especializado",
    text: "Atendimento direto com quem entende de hardware corporativo.",
  },
  {
    icon: Truck,
    title: "Entrega nacional",
    text: "Logística segura com rastreio para qualquer estado.",
  },
  {
    icon: ShieldCheck,
    title: "Compra protegida",
    text: "Equipamentos revisados, testados e com direito de devolução.",
  },
];

const RENTAL_BENEFITS = [
  { icon: CalendarClock, label: "Contratos flexíveis, sem fidelidade longa" },
  { icon: Wrench, label: "Manutenção e reposição inclusas" },
  { icon: FileText, label: "Locação dedutível como despesa operacional" },
];

const BRAND_NAMES = ["Dell", "HP", "Lenovo", "Cisco", "Samsung", "LG"];

export default async function Home() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      take: 7,
    }),
    prisma.product.findMany({
      where: { active: true },
      include: {
        brand: true,
        images: { where: { isMain: true }, take: 1 },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 8,
    }),
  ]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>
              Tecnologia corporativa que cabe no orçamento da sua empresa
            </h1>
            <p className={styles.heroSubtitle}>
              Notebooks, desktops e servidores Dell, HP e Lenovo seminovos —
              revisados peça a peça, com garantia real e nota fiscal. Compre
              ou alugue.
            </p>
            <div className={styles.heroActions}>
              <Link href="/categoria/notebooks" className={styles.heroCta}>
                Ver notebooks
                <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.heroCtaSecondary}
              >
                <MessageCircle size={18} strokeWidth={2} aria-hidden />
                Falar com especialista
              </a>
            </div>
            <ul className={styles.heroChips}>
              {HERO_CHIPS.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Icon size={15} strokeWidth={2.25} aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.heroMedia}>
            <Image
              src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80"
              alt="Notebook corporativo sobre mesa de trabalho organizada"
              fill
              sizes="(max-width: 900px) 100vw, 520px"
              priority
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      <section className={styles.brandStrip} aria-label="Marcas com que trabalhamos">
        <div className={`container ${styles.brandStripInner}`}>
          <span className={styles.brandStripLabel}>
            As marcas que o mercado confia
          </span>
          <ul>
            {BRAND_NAMES.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <h2>O que você procura hoje?</h2>
          <Link href="/categorias" className={styles.sectionLink}>
            Todas as categorias
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
                  <Icon size={26} strokeWidth={1.75} aria-hidden />
                </span>
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <h2>Recomendados para sua empresa</h2>
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
                imageUrl={product.images[0]?.url ?? null}
                imageAlt={product.images[0]?.altText ?? null}
              />
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>Nenhum produto cadastrado ainda.</p>
        )}
      </section>

      <section className={`container ${styles.rental}`}>
        <div className={styles.rentalInner}>
          <div className={styles.rentalCopy}>
            <h2>Locação corporativa de equipamentos</h2>
            <p>
              Equipe sua operação sem imobilizar capital. Parque de máquinas
              atualizado, manutenção por nossa conta e contrato sob medida
              para o tamanho da sua empresa.
            </p>
            <ul className={styles.rentalBenefits}>
              {RENTAL_BENEFITS.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Icon size={18} strokeWidth={2} aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.rentalCta}
            >
              Pedir proposta de locação
              <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
            </a>
          </div>
          <div className={styles.rentalMedia}>
            <Image
              src="https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80"
              alt="Corredor de servidores em datacenter iluminado"
              fill
              sizes="(max-width: 900px) 100vw, 480px"
              className={styles.rentalImage}
            />
          </div>
        </div>
      </section>

      <section className={`container ${styles.trust}`}>
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className={styles.trustItem}>
            <item.icon
              size={22}
              strokeWidth={2}
              className={styles.trustIcon}
              aria-hidden
            />
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappFloat}
        aria-label="Conversar no WhatsApp"
      >
        <MessageCircle size={26} strokeWidth={2} aria-hidden />
      </a>
    </div>
  );
}
