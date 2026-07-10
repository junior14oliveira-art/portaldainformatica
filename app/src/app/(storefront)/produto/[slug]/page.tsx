import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  ChevronRight,
  FileText,
  Laptop,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { COMPANY, SITE_URL } from "@/constants/company";
import { getProductReviews } from "@/services/review-service";
import { getProductQuestions } from "@/services/question-service";
import { StarRating } from "@/components/review/StarRating";
import { ReviewForm } from "@/components/review/ReviewForm";
import { QuestionForm } from "@/components/review/QuestionForm";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { where: { isMain: true }, take: 1 } },
  });
  if (!product) return {};

  const title = product.metaTitle ?? product.name;
  const description =
    product.metaDescription ?? product.shortDescription ?? undefined;
  const image = product.images[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `/produto/${product.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE_URL}/produto/${product.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
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
  const mainImage = product.images[0];
  const { reviews, average, count } = await getProductReviews(product.id);
  const questions = await getProductQuestions(product.id);

  const whatsappProduct = `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(
    `Olá! Tenho interesse no produto: ${product.name} (${product.sku})`
  )}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.shortDescription ?? product.description ?? undefined,
    image: mainImage ? [mainImage.url] : undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/produto/${product.slug}`,
      priceCurrency: "BRL",
      price: (pricePix ?? price).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
    },
    aggregateRating:
      count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: average.toFixed(1),
            reviewCount: count,
          }
        : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category.name,
        item: `${SITE_URL}/categoria/${product.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/produto/${product.slug}`,
      },
    ],
  };

  return (
    <div className={`container ${styles.page}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
          {count > 0 ? (
            <div className={styles.ratingSummary}>
              <StarRating value={average} size={15} />
              <span>
                {average.toFixed(1)} ({count} {count === 1 ? "avaliação" : "avaliações"})
              </span>
            </div>
          ) : null}
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
              </>
            ) : (
              <div className={styles.pixRow}>
                <span className={styles.pixPrice}>{currency.format(price)}</span>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <AddToCartButton
              productId={product.id}
              className={styles.buyButton}
              label="Adicionar ao carrinho"
            />
            <a
              href={whatsappProduct}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappButton}
            >
              <WhatsAppIcon size={18} />
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

      <section className={styles.reviews}>
        <h2>Avaliações {count > 0 ? `(${count})` : ""}</h2>

        {reviews.length > 0 ? (
          <div className={styles.reviewList}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <StarRating value={review.rating} size={14} />
                  <span className={styles.reviewAuthor}>{review.user.name}</span>
                  {review.verifiedPurchase ? (
                    <span className={styles.reviewVerified}>Compra verificada</span>
                  ) : null}
                </div>
                {review.comment ? (
                  <p className={styles.reviewComment}>{review.comment}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.reviewsEmpty}>
            Ainda não há avaliações para este produto. Seja o primeiro a avaliar!
          </p>
        )}

        <ReviewForm productId={product.id} slug={product.slug} />
      </section>

      <section className={styles.reviews}>
        <h2>Perguntas e respostas {questions.length > 0 ? `(${questions.length})` : ""}</h2>

        {questions.length > 0 ? (
          <div className={styles.reviewList}>
            {questions.map((q) => (
              <div key={q.id} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewAuthor}>{q.user.name} perguntou:</span>
                </div>
                <p className={styles.reviewComment}>{q.question}</p>
                {q.answer ? (
                  <p className={styles.reviewComment}>
                    <strong>Resposta da Portal One:</strong> {q.answer}
                  </p>
                ) : (
                  <p className={styles.reviewsEmpty}>Ainda não respondida.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.reviewsEmpty}>Ainda não há perguntas para este produto.</p>
        )}

        <QuestionForm productId={product.id} slug={product.slug} />
      </section>

      {related.length > 0 ? (
        <section className={styles.related}>
          <h2>Produtos relacionados</h2>
          <div className={styles.relatedGrid}>
            {related.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
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
