import { PrismaClient, PersonType, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

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
    { name: "Computadores", slug: "computadores", color: "#20AAA0" },
    { name: "Notebooks", slug: "notebooks", color: "#2563EB" },
    { name: "Monitores", slug: "monitores", color: "#20AAA0" },
    { name: "Acessórios", slug: "acessorios", color: "#20AAA0" },
    { name: "Hardware", slug: "hardware", color: "#20AAA0" },
    { name: "Servidores", slug: "servidores", color: "#20AAA0" },
    { name: "Switch de Rede", slug: "switch-de-rede", color: "#20AAA0" },
  ];

  const categories = [];
  for (const data of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: data.slug },
      update: {},
      create: data,
    });
    categories.push(category);
  }

  const brandsData = [
    { name: "Dell", slug: "dell" },
    { name: "HP", slug: "hp" },
    { name: "Lenovo", slug: "lenovo" },
  ];

  const brands = [];
  for (const data of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { slug: data.slug },
      update: {},
      create: data,
    });
    brands.push(brand);
  }

  const notebooksCategory = categories.find((c) => c.slug === "notebooks")!;
  const dell = brands.find((b) => b.slug === "dell")!;

  await prisma.product.upsert({
    where: { sku: "NB-DELL-LAT5420" },
    update: {},
    create: {
      sku: "NB-DELL-LAT5420",
      name: "Notebook Dell Latitude 5420 Seminovo",
      slug: "notebook-dell-latitude-5420-seminovo",
      shortDescription: "Notebook corporativo seminovo, revisado e com garantia.",
      description:
        "Notebook Dell Latitude 5420 seminovo, ideal para uso corporativo. Revisado, testado e com garantia de 6 meses.",
      brandId: dell.id,
      categoryId: notebooksCategory.id,
      price: 3499.9,
      pricePix: 3149.9,
      warrantyMonths: 6,
      active: true,
      featured: true,
    },
  });

  console.log({ admin: admin.email, categories: categories.length, brands: brands.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
