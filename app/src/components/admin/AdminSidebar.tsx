"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Tags,
  Star,
  Users,
  Newspaper,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import styles from "./AdminSidebar.module.css";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { href: "/admin/marcas", label: "Marcas", icon: Tags },
  { href: "/admin/avaliacoes", label: "Avaliações", icon: Star },
  { href: "/admin/perguntas", label: "Perguntas", icon: HelpCircle },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Image
          src="/institucional/logo.png"
          alt="Portal One"
          width={120}
          height={45}
        />
        <span className={styles.brandTag}>Admin</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
            >
              <Icon size={18} strokeWidth={2} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <Link href="/" className={styles.viewStore}>
        <ExternalLink size={16} strokeWidth={2} aria-hidden />
        Ver loja
      </Link>
    </aside>
  );
}
