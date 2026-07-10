import styles from "./OrderStatusBadge.module.css";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  PAYMENT_APPROVED: "Pago",
  PROCESSING: "Em preparação",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const STATUS_VARIANTS: Record<string, string> = {
  PENDING: "pending",
  PAYMENT_APPROVED: "success",
  PROCESSING: "info",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "danger",
  REFUNDED: "danger",
};

export function OrderStatusBadge({ status }: { status: string }) {
  const variant = STATUS_VARIANTS[status] ?? "pending";
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
