"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createPageAction } from "@/app/admin/paginas/actions";
import styles from "@/app/admin/produtos/page.module.css";

// Formulario de criacao de pagina. Client component porque a action pode
// retornar erro (slug duplicado) que precisamos exibir sem sair da tela.
export function CreatePageForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createPageAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div>
      <form action={handleSubmit} className={styles.createPageRow}>
        <input name="title" placeholder="Título da nova página..." required />
        <button type="submit" className={styles.newButton} disabled={isPending}>
          <Plus size={16} strokeWidth={2.25} aria-hidden />
          {isPending ? "Criando..." : "Criar página"}
        </button>
      </form>
      {error ? <p className={styles.empty}>{error}</p> : null}
    </div>
  );
}
