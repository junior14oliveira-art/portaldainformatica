import { PrismaClient, PersonType, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

async function main() {
  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@portaloneinformatica.com" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "Portal One",
      email: "admin@portaloneinformatica.com",
      passwordHash: adminPasswordHash,
      personType: PersonType.JURIDICA,
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });

  const categoriesData = [
    { name: "Computadores", slug: "computadores", order: 1 },
    { name: "Notebooks", slug: "notebooks", order: 2 },
    { name: "Monitores", slug: "monitores", order: 3 },
    { name: "Acessórios", slug: "acessorios", order: 4 },
    { name: "Hardware", slug: "hardware", order: 5 },
    { name: "Servidores", slug: "servidores", order: 6 },
    { name: "Switch de Rede", slug: "switch-de-rede", order: 7 },
  ];

  const categories: Record<string, string> = {};
  for (const data of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: data.slug },
      update: { order: data.order },
      create: data,
    });
    categories[data.slug] = category.id;
  }

  const brandsData = [
    { name: "Dell", slug: "dell" },
    { name: "HP", slug: "hp" },
    { name: "Lenovo", slug: "lenovo" },
    { name: "Cisco", slug: "cisco" },
  ];

  const brands: Record<string, string> = {};
  for (const data of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { slug: data.slug },
      update: {},
      create: data,
    });
    brands[data.slug] = brand.id;
  }

  const productsData = [
    {
      sku: "NB-DELL-LAT5420",
      name: "Notebook Dell Latitude 5420 i5-1135G7 16GB SSD 256GB",
      slug: "notebook-dell-latitude-5420-seminovo",
      shortDescription:
        "Corporativo seminovo revisado — Intel Core i5 11ª geração, 16GB RAM, SSD NVMe.",
      brand: "dell",
      category: "notebooks",
      price: 2899.9,
      pricePix: 2609.9,
      featured: true,
      image: "1496181133206-80ce9b88a853",
      imageAlt: "Notebook Dell Latitude aberto sobre mesa de escritório",
    },
    {
      sku: "NB-LEN-T14-R5",
      name: "Notebook Lenovo ThinkPad T14 Ryzen 5 PRO 16GB SSD 512GB",
      slug: "notebook-lenovo-thinkpad-t14-seminovo",
      shortDescription:
        "Linha ThinkPad — teclado premiado, chassi reforçado, Ryzen 5 PRO com 16GB.",
      brand: "lenovo",
      category: "notebooks",
      price: 3199.9,
      pricePix: 2879.9,
      featured: true,
      image: "1541807084-5c52b6b3adef",
      imageAlt: "Notebook profissional sobre mesa com iluminação suave",
    },
    {
      sku: "NB-HP-840G8-I7",
      name: "Notebook HP EliteBook 840 G8 i7-1165G7 16GB SSD 512GB",
      slug: "notebook-hp-elitebook-840-g8-seminovo",
      shortDescription:
        "Ultrabook corporativo premium — i7 11ª geração, tela Full HD antirreflexo.",
      brand: "hp",
      category: "notebooks",
      price: 3799.9,
      pricePix: 3419.9,
      featured: true,
      image: "1517336714731-489689fd1ca8",
      imageAlt: "Notebook fino e prateado parcialmente fechado",
    },
    {
      sku: "PC-DELL-7080-SFF",
      name: "Desktop Dell OptiPlex 7080 SFF i5-10500 8GB SSD 256GB",
      slug: "desktop-dell-optiplex-7080-sff-seminovo",
      shortDescription:
        "Desktop compacto para escritório — i5 10ª geração, pronto para uso com Windows.",
      brand: "dell",
      category: "computadores",
      price: 1899.9,
      pricePix: 1709.9,
      featured: true,
      image: "1547082299-de196ea013d6",
      imageAlt: "Estação de trabalho com desktop e monitor em escritório",
    },
    {
      sku: "MN-DELL-P2419H",
      name: 'Monitor Dell P2419H 24" Full HD IPS',
      slug: "monitor-dell-p2419h-24-seminovo",
      shortDescription:
        "Painel IPS com bordas finas, ajuste de altura e rotação — ideal para produtividade.",
      brand: "dell",
      category: "monitores",
      price: 549.9,
      pricePix: 494.9,
      featured: false,
      image: "1527443224154-c4a3942d3acf",
      imageAlt: "Monitor em mesa de trabalho minimalista",
    },
    {
      sku: "MN-DELL-U2419H",
      name: 'Monitor Dell UltraSharp U2419H 24" Full HD',
      slug: "monitor-dell-ultrasharp-u2419h-seminovo",
      shortDescription:
        "Linha UltraSharp — cores calibradas de fábrica, ideal para design e escritório.",
      brand: "dell",
      category: "monitores",
      price: 699.9,
      pricePix: 629.9,
      featured: false,
      image: "1588872657578-7efd1f1555ed",
      imageAlt: "Monitor widescreen exibindo interface de trabalho",
    },
    {
      sku: "SV-DELL-R440",
      name: "Servidor Dell PowerEdge R440 2x Xeon Silver 64GB",
      slug: "servidor-dell-poweredge-r440-seminovo",
      shortDescription:
        "Servidor rack 1U revisado — dois Xeon Silver, 64GB ECC, ideal para virtualização.",
      brand: "dell",
      category: "servidores",
      price: 8900.0,
      pricePix: 8010.0,
      featured: true,
      image: "1558494949-ef010cbdcc31",
      imageAlt: "Servidores em rack com cabos organizados",
    },
    {
      sku: "SW-CISCO-2960X-48",
      name: "Switch Cisco Catalyst 2960-X 48 portas Gigabit",
      slug: "switch-cisco-catalyst-2960x-48p-seminovo",
      shortDescription:
        "Switch gerenciável 48 portas Gigabit + 4 SFP — o padrão corporativo em rede.",
      brand: "cisco",
      category: "switch-de-rede",
      price: 2400.0,
      pricePix: 2160.0,
      featured: false,
      image: "1547394765-185e1e68f34e",
      imageAlt: "Cabos de rede conectados a um switch",
    },
  ];

  for (const data of productsData) {
    const product = await prisma.product.upsert({
      where: { sku: data.sku },
      update: {
        price: data.price,
        pricePix: data.pricePix,
        featured: data.featured,
        shortDescription: data.shortDescription,
      },
      create: {
        sku: data.sku,
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        brandId: brands[data.brand],
        categoryId: categories[data.category],
        price: data.price,
        pricePix: data.pricePix,
        warrantyMonths: 6,
        active: true,
        featured: data.featured,
      },
    });

    const existingImage = await prisma.productImage.findFirst({
      where: { productId: product.id, isMain: true },
    });
    if (!existingImage) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: unsplash(data.image),
          altText: data.imageAlt,
          isMain: true,
        },
      });
    }
  }

  console.log({
    admin: admin.email,
    categories: Object.keys(categories).length,
    brands: Object.keys(brands).length,
    products: productsData.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
