"use client";

import { Render, type Data } from "@measured/puck";
import { puckConfig } from "@/lib/puck/config";

// Renderiza no site publico o layout montado no editor. Client component
// porque o Render do Puck usa contexto interno do React.
export function PuckRenderer({ data }: { data: Data }) {
  return <Render config={puckConfig} data={data} />;
}
