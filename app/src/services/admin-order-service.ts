import type { OrderStatus } from "@prisma/client";
import * as repo from "@/repositories/admin-order-repository";

export function listOrders(status?: OrderStatus) {
  return repo.findOrders(status);
}

export function getOrder(id: string) {
  return repo.findOrderById(id);
}

export function changeOrderStatus(id: string, status: OrderStatus) {
  return repo.updateOrderStatus(id, status);
}
