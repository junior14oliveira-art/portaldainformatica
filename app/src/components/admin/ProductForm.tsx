"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import styles from "./ProductForm.module.css";

type Option = { id: string; name: string };

type ProductFormValues = {
  id?: string;
  sku: string;
  name: string;
  slug: string;
  categoryId: string;
  brandId: string | null;
  shortDescription: string | null;
  description: string | null;
  price: number;
  pricePix: number | null;
  warrantyMonths: number | null;
  active: boolean;
  featured: boolean;
  imageUrl: string | null;
};

type ProductFormProps = {
  categories: Option[];
  brands: Option[];
  initialValues?: ProductFormValues;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({ categories, brands, initialValues, action }: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialValues?.name ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initialValues);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form action={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="name">Nome do produto</label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="sku">SKU</label>
          <input id="sku" name="sku" defaultValue={initialValues?.sku} required />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="slug">Slug (URL)</label>
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          required
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="categoryId">Categoria</label>
          <select id="categoryId" name="categoryId" defaultValue={initialValues?.categoryId} required>
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="brandId">Marca</label>
          <select id="brandId" name="brandId" defaultValue={initialValues?.brandId ?? ""}>
            <option value="">Sem marca</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="price">Preço (R$)</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialValues?.price}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="pricePix">Preço no PIX (R$, opcional)</label>
          <input
            id="pricePix"
            name="pricePix"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialValues?.pricePix ?? undefined}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="warrantyMonths">Garantia (meses)</label>
          <input
            id="warrantyMonths"
            name="warrantyMonths"
            type="number"
            min="0"
            defaultValue={initialValues?.warrantyMonths ?? 6}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="shortDescription">Descrição curta</label>
        <input
          id="shortDescription"
          name="shortDescription"
          defaultValue={initialValues?.shortDescription ?? ""}
          maxLength={300}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description">Descrição completa</label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={initialValues?.description ?? ""}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="imageUrl">URL da imagem principal</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://..."
          defaultValue={initialValues?.imageUrl ?? ""}
        />
      </div>

      <div className={styles.checkboxRow}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="active" defaultChecked={initialValues?.active ?? true} />
          Produto ativo (visível na loja)
        </label>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="featured" defaultChecked={initialValues?.featured ?? false} />
          Destacar na Home
        </label>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.actions}>
        <button type="button" className={styles.cancel} onClick={() => router.back()}>
          Cancelar
        </button>
        <button type="submit" className={styles.submit} disabled={isPending}>
          {isPending ? <Loader2 size={16} className="spin" aria-hidden /> : null}
          {initialValues ? "Salvar alterações" : "Criar produto"}
        </button>
      </div>
    </form>
  );
}
