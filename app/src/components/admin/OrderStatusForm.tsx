"use client";

import { useState, useTransition } from "react";
import type { OrderStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { updateOrderStatusAction } from "@/app/admin/pedidos/actions";
import styles from "./OrderStatusForm.module.css";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pendente" },
  { value: "PAYMENT_APPROVED", label: "Pago" },
  { value: "PROCESSING", label: "Em preparação" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "REFUNDED", label: "Reembolsado" },
];

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  function handleChange(next: OrderStatus) {
    setStatus(next);
    // Atualiza direto ao trocar a opção; sem botão extra de "salvar"
    // para reduzir cliques no fluxo mais comum do dia a dia do admin.
    startTransition(() => updateOrderStatusAction(orderId, next));
  }

  return (
    <div className={styles.wrapper}>
      <label htmlFor="status" className={styles.label}>
        Status do pedido
      </label>
      <select
        id="status"
        value={status}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        disabled={isPending}
        className={styles.select}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {isPending ? <Loader2 size={16} className="spin" aria-hidden /> : null}
    </div>
  );
}
