"use client";

import { useTransition } from "react";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { addToCartAction } from "@/app/cart-actions";

type AddToCartButtonProps = {
  productId: string;
  className?: string;
  label?: string;
};

export function AddToCartButton({
  productId,
  className,
  label = "Comprar",
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    startTransition(async () => {
      await addToCartAction(productId, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    });
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={isPending}
      aria-live="polite"
    >
      {isPending ? (
        <Loader2 size={16} strokeWidth={2.25} className="spin" aria-hidden />
      ) : justAdded ? (
        <Check size={16} strokeWidth={2.25} aria-hidden />
      ) : (
        <ShoppingCart size={16} strokeWidth={2.25} aria-hidden />
      )}
      {justAdded ? "Adicionado!" : label}
    </button>
  );
}
