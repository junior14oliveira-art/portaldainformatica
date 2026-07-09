import {
  Cpu,
  Headphones,
  Laptop,
  Monitor,
  Network,
  Server,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  computadores: Cpu,
  notebooks: Laptop,
  monitores: Monitor,
  acessorios: Headphones,
  hardware: Cpu,
  servidores: Server,
  "switch-de-rede": Network,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Cpu;
}
