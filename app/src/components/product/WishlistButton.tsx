"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleWishlistAction } from "@/app/wishlist-actions";
import styles from "./WishlistButton.module.css";

type WishlistButtonProps = {
  productId: string;
  initialInWishlist?: boolean;
  variant?: "floating" | "inline";
};

// Botao de favoritar. Otimista: troca o icone na hora e reverte se a action
// falhar. Se o usuario nao estiver logado, manda pra tela de login.
export function WishlistButton({
  productId,
  initialInWishlist = false,
  variant = "floating",
}: WishlistButtonProps) {
  const router = useRouter();
  const [active, setActive] = useState(initialInWishlist);
  const [, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const previous = active;
    setActive(!previous);

    startTransition(async () => {
      const result = await toggleWishlistAction(productId);
      if ("requiresLogin" in result) {
        setActive(previous);
        router.push("/entrar?callbackURL=/favoritos");
        return;
      }
      setActive(result.inWishlist);
    });
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${styles[variant]} ${active ? styles.active : ""}`}
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart
        size={variant === "inline" ? 18 : 20}
        strokeWidth={2}
        fill={active ? "currentColor" : "none"}
        aria-hidden
      />
      {variant === "inline" ? (active ? "Favoritado" : "Favoritar") : null}
    </button>
  );
}
