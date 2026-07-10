import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

export function findOrders(status?: OrderStatus) {
  return prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function findOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      address: true,
      items: { include: { product: { include: { images: { where: { isMain: true } } } } } },
      payments: true,
    },
  });
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({ where: { id }, data: { status } });
}
