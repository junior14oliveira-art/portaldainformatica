"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import styles from "./ProductForm.module.css";

type BlogPostFormValues = {
  title: string;
  slug: string;
  authorName: string | null;
  content: string;
  imageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  published: boolean;
};

type BlogPostFormProps = {
  initialValues?: BlogPostFormValues;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BlogPostForm({ initialValues, action }: BlogPostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initialValues);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="title">Título</label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />
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
          <label htmlFor="authorName">Autor</label>
          <input id="authorName" name="authorName" defaultValue={initialValues?.authorName ?? ""} />
        </div>
        <div className={styles.field}>
          <label htmlFor="imageUrl">URL da imagem de capa</label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            placeholder="https://..."
            defaultValue={initialValues?.imageUrl ?? ""}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="content">Conteúdo</label>
        <textarea id="content" name="content" rows={10} defaultValue={initialValues?.content ?? ""} required />
      </div>

      <div className={styles.field}>
        <label htmlFor="metaTitle">Meta título (SEO, opcional)</label>
        <input id="metaTitle" name="metaTitle" defaultValue={initialValues?.metaTitle ?? ""} />
      </div>

      <div className={styles.field}>
        <label htmlFor="metaDescription">Meta descrição (SEO, opcional)</label>
        <input id="metaDescription" name="metaDescription" defaultValue={initialValues?.metaDescription ?? ""} />
      </div>

      <div className={styles.checkboxRow}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="published" defaultChecked={initialValues?.published ?? false} />
          Publicado (visível no blog da loja)
        </label>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.actions}>
        <button type="button" className={styles.cancel} onClick={() => router.back()}>
          Cancelar
        </button>
        <button type="submit" className={styles.submit} disabled={isPending}>
          {isPending ? <Loader2 size={16} className="spin" aria-hidden /> : null}
          {initialValues ? "Salvar alterações" : "Criar artigo"}
        </button>
      </div>
    </form>
  );
}
