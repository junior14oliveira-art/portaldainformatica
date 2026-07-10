"use client";

import { useTransition } from "react";
import { Loader2, Zap } from "lucide-react";
import { simulatePaymentAction } from "@/app/checkout/actions";
import styles from "./SimulatePaymentButton.module.css";

export function SimulatePaymentButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await simulatePaymentAction(orderId);
    });
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.notice}>
        Ambiente de simulação — em produção esta etapa é automática, via webhook do
        Mercado Pago.
      </p>
      <button type="button" className={styles.button} onClick={handleClick} disabled={isPending}>
        {isPending ? (
          <Loader2 size={18} className="spin" aria-hidden />
        ) : (
          <Zap size={18} strokeWidth={2.25} aria-hidden />
        )}
        Simular pagamento aprovado
      </button>
    </div>
  );
}
