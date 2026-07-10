import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { COMPANY, SITE_URL } from "@/constants/company";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const TITLE = "Portal One Informática — Venda e Locação de Equipamentos";
const DESCRIPTION =
  "Compra, venda e locação de computadores, notebooks e servidores corporativos seminovos Dell, HP e Lenovo — revisados, com garantia e nota fiscal. Guarulhos/SP, entrega para todo o Brasil.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Portal One Informática",
  },
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/institucional/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Portal One Informática",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/institucional/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.name,
  url: SITE_URL,
  logo: `${SITE_URL}/institucional/logo.png`,
  image: `${SITE_URL}/institucional/logo.png`,
  telephone: COMPANY.phone,
  email: COMPANY.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.streetAddress,
    addressLocality: COMPANY.addressLocality,
    addressRegion: COMPANY.addressRegion,
    postalCode: COMPANY.postalCode,
    addressCountry: "BR",
  },
  sameAs: [COMPANY.facebook, COMPANY.instagram],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: COMPANY.name,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/busca?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
