import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Data } from "@measured/puck";
import { findPageById } from "@/repositories/page-repository";
import { PageEditor } from "@/components/admin/PageEditor";

export const metadata: Metadata = { title: "Editor visual" };

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await findPageById(id);
  if (!page) notFound();

  return (
    <PageEditor
      pageId={page.id}
      slug={page.slug}
      initialData={page.data as unknown as Data}
      initialTitle={page.title}
      initialPublished={page.published}
    />
  );
}
