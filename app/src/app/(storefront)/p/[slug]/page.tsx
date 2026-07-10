import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Data } from "@measured/puck";
import { findPublishedPageBySlug } from "@/repositories/page-repository";
import { PuckRenderer } from "@/components/PuckRenderer";
import { SITE_URL } from "@/constants/company";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await findPublishedPageBySlug(slug);
  if (!page) return {};
  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDescription ?? undefined,
    alternates: { canonical: `/p/${page.slug}` },
    openGraph: {
      type: "website",
      title: page.metaTitle ?? page.title,
      description: page.metaDescription ?? undefined,
      url: `${SITE_URL}/p/${page.slug}`,
    },
  };
}

export default async function PublicBuilderPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await findPublishedPageBySlug(slug);
  if (!page) notFound();

  return <PuckRenderer data={page.data as unknown as Data} />;
}
