"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Puck, type Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/lib/puck/config";
import { savePageAction } from "@/app/admin/paginas/actions";
import styles from "./PageEditor.module.css";

type PageEditorProps = {
  pageId: string;
  slug: string;
  initialData: Data;
  initialTitle: string;
  initialPublished: boolean;
};

// Editor visual (Puck) que envolve os blocos definidos em lib/puck/config.
// O botao "Publicar" do proprio Puck salva o layout no banco via server action.
export function PageEditor({
  pageId,
  slug,
  initialData,
  initialTitle,
  initialPublished,
}: PageEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handlePublish(data: Data) {
    setSaving(true);
    await savePageAction(pageId, data as never, { published: true });
    setSaving(false);
    router.push("/admin/paginas");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <div>
          <strong>{initialTitle}</strong>
          <span className={styles.slug}>/p/{slug}</span>
        </div>
        <span className={styles.status}>
          {initialPublished ? "Publicada" : "Rascunho"}
          {saving ? " · salvando..." : ""}
        </span>
      </div>
      <Puck config={puckConfig} data={initialData} onPublish={handlePublish} />
    </div>
  );
}
