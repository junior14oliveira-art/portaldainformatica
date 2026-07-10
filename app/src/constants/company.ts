export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const COMPANY = {
  name: "Portal One Informática",
  legalFoundedYear: 2021,
  phone: "(11) 3500-8079",
  phoneHref: "tel:1135008079",
  email: "compras@portaloneinformatica.com.br",
  address:
    "Rua Antônio Custódio de Castro, 364 - Vila Galvão - Guarulhos/SP - CEP 07074-150",
  addressShort: "Guarulhos, SP - Brasil",
  streetAddress: "Rua Antônio Custódio de Castro, 364",
  addressLocality: "Guarulhos",
  addressRegion: "SP",
  postalCode: "07074-150",
  mapsUrl: "https://maps.app.goo.gl/jUr63m9pRyWjpW9n6",
  whatsappNumber: "5511910345060",
  facebook: "https://www.facebook.com/Portaloneinformatica",
  instagram: "https://www.instagram.com/portaloneinformatica",
} as const;

export const WHATSAPP_URL = `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(
  "Olá! Quero falar com um especialista."
)}`;

export const WHATSAPP_RENTAL_URL = `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(
  "Olá! Quero uma proposta de locação de equipamentos."
)}`;
