import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Portal One Informática — Venda e Locação de Equipamentos",
    template: "%s | Portal One Informática",
  },
  description:
    "Compra, venda e locação de computadores, notebooks e servidores corporativos seminovos Dell, HP e Lenovo — revisados, com garantia e nota fiscal. Guarulhos/SP, entrega para todo o Brasil.",
  icons: {
    icon: "/institucional/favicon.png",
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
