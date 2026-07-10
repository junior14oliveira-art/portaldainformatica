"use server";

import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/admin-guard";
import { changeOrderStatus } from "@/services/admin-order-service";

// Atualiza o status de um pedido manualmente (uso do admin).
// Em produção, boa parte dessas transições viria de webhooks
// (pagamento aprovado) ou da transportadora (enviado/entregue).
export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  await requireAdmin();
  await changeOrderStatus(orderId, status);
  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
}
