import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    revenueAgg,
    totalOrders,
    pendingOrders,
    activeProducts,
    totalCustomers,
    recentOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { in: ["PAYMENT_APPROVED", "PROCESSING", "SHIPPED", "DELIVERED"] } },
      _sum: { total: true },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { active: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return {
    revenue: Number(revenueAgg._sum.total ?? 0),
    totalOrders,
    pendingOrders,
    activeProducts,
    totalCustomers,
    recentOrders,
  };
}

export function getTopProducts(limit = 5) {
  return prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true, total: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });
}
