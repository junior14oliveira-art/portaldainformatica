import { prisma } from "@/lib/prisma";
import * as dashboardRepository from "@/repositories/dashboard-repository";

export async function getDashboardData() {
  const stats = await dashboardRepository.getDashboardStats();
  const topProductsRaw = await dashboardRepository.getTopProducts();

  const products = await prisma.product.findMany({
    where: { id: { in: topProductsRaw.map((p) => p.productId) } },
    select: { id: true, name: true, slug: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const topProducts = topProductsRaw
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;
      return {
        ...product,
        quantitySold: item._sum.quantity ?? 0,
        revenue: Number(item._sum.total ?? 0),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return { ...stats, topProducts };
}
