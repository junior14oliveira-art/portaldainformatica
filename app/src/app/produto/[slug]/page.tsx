import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  ChevronRight,
  FileText,
  Laptop,
  MessageCircle,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { COMPANY } from "@/constants/company";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const INSTALLMENTS = 10;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.shortDescription ?? undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      images: { orderBy: [{ isMain: "desc" }, { order: "asc" }] },
    },
  });

  if (!product || !product.active) notFound();

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      active: true,
      id: { not: product.id },
    },
    include: {
      brand: true,
      images: { where: { isMain: true }, take: 1 },
    },
    take: 4,
  });

  const price = Number(product.price);
  const pricePix = product.pricePix ? Number(product.pricePix) : null;
  const installment = price / INSTALLMENTS;
  const mainImage = product.images[0];

  const whatsappProduct = `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(
    `Olá! Tenho interesse no produto: ${product.name} (${product.sku})`
  )}`;

  return (
    <div className={`container ${styles.page}`}>
      <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
        <Link href="/">Início</Link>
        <ChevronRight size={14} strokeWidth={2} aria-hidden />
        <Link href={`/categoria/${product.category.slug}`}>
          {product.category.name}
        </Link>
        <ChevronRight size={14} strokeWidth={2} aria-hidden />
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className={styles.main}>
        <div className={styles.gallery}>
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.altText ?? product.name}
              fill
              sizes="(max-width: 900px) 100vw, 560px"
              priority
              className={styles.galleryImage}
            />
          ) : (
            <span className={styles.galleryPlaceholder}>
              <Laptop size={64} strokeWidth={1.25} aria-hidden />
            </span>
          )}
          <span className={styles.condition}>Seminovo revisado</span>
        </div>

        <div className={styles.buyBox}>
          {product.brand ? (
            <span className={styles.brand}>{product.brand.name}</span>
          ) : null}
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.sku}>SKU: {product.sku}</p>

          {product.shortDescription ? (
            <p className={styles.shortDescription}>{product.shortDescription}</p>
          ) : null}

          <div className={styles.priceBox}>
            {pricePix ? (
              <>
                <div className={styles.pixRow}>
                  <Zap size={20} strokeWidth={2.25} aria-hidden />
                  <span className={styles.pixPrice}>{currency.format(pricePix)}</span>
                  <span className={styles.pixLabel}>no PIX</span>
                </div>
                <p className={styles.installments}>
                  ou {currency.format(price)} em até {INSTALLMENTS}x de{" "}
                  {currency.format(installment)} sem juros
                </p>
              </>
            ) : (
              <div className={styles.pixRow}>
                <span className={styles.pixPrice}>{currency.format(price)}</span>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.buyButton}>
              <ShoppingCart size={18} strokeWidth={2.25} aria-hidden />
              Adicionar ao carrinho
            </button>
            <a
              href={whatsappProduct}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappButton}
            >
              <MessageCircle size={18} strokeWidth={2} aria-hidden />
              Comprar pelo WhatsApp
            </a>
          </div>

          <ul className={styles.assurances}>
            <li>
              <BadgeCheck size={16} strokeWidth={2} aria-hidden />
              Garantia de {product.warrantyMonths ?? 6} meses
            </li>
            <li>
              <FileText size={16} strokeWidth={2} aria-hidden />
              Nota fiscal
            </li>
            <li>
              <ShieldCheck size={16} strokeWidth={2} aria-hidden />
              Revisado e testado
            </li>
            <li>
              <Truck size={16} strokeWidth={2} aria-hidden />
              Envio para todo o Brasil
            </li>
          </ul>
        </div>
      </div>

      {product.description ? (
        <section className={styles.description}>
          <h2>Descrição</h2>
          <p>{product.description}</p>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className={styles.related}>
          <h2>Produtos relacionados</h2>
          <div className={styles.relatedGrid}>
            {related.map((item) => (
              <ProductCard
                key={item.id}
                slug={item.slug}
                name={item.name}
                brand={item.brand?.name}
                price={Number(item.price)}
                pricePix={item.pricePix ? Number(item.pricePix) : null}
                imageUrl={item.images[0]?.url ?? null}
                imageAlt={item.images[0]?.altText ?? null}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
