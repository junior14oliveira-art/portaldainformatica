import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api/",
        "/entrar",
        "/cadastro",
        "/minha-conta",
        "/checkout",
        "/carrinho",
        "/pedido/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
