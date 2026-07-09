import Link from "next/link";
import { Menu, Search, ShieldCheck, ShoppingCart, Truck, User, Zap } from "lucide-react";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Computadores", href: "/categoria/computadores" },
  { label: "Notebooks", href: "/categoria/notebooks" },
  { label: "Acessórios", href: "/categoria/acessorios" },
  { label: "Hardware", href: "/categoria/hardware" },
  { label: "Servidores", href: "/categoria/servidores" },
];

const TOPBAR_ITEMS = [
  { icon: Zap, label: "Pague no PIX com segurança" },
  { icon: ShieldCheck, label: "Equipamentos com garantia" },
  { icon: Truck, label: "Entrega para todo o Brasil" },
];

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topbar}>
        <div className={`container ${styles.topbarInner}`}>
          {TOPBAR_ITEMS.map(({ icon: Icon, label }) => (
            <span key={label} className={styles.topbarItem}>
              <Icon size={14} strokeWidth={2.25} aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className={`container ${styles.main}`}>
        <Link href="/" className={styles.logo}>
          Portal <strong>One</strong>
          <span className={styles.logoSub}>Informática</span>
        </Link>

        <form className={styles.search} role="search">
          <input
            type="search"
            name="q"
            placeholder="O que você está procurando?"
            aria-label="Buscar produtos"
          />
          <button type="submit" aria-label="Buscar">
            <Search size={18} strokeWidth={2.25} />
          </button>
        </form>

        <div className={styles.actions}>
          <Link href="/minha-conta" className={styles.actionItem}>
            <User size={20} strokeWidth={2} aria-hidden />
            <span className={styles.actionText}>
              <span className={styles.actionLabel}>Minha conta</span>
              <span className={styles.actionSub}>Entrar / Cadastro</span>
            </span>
          </Link>
          <Link href="/carrinho" className={styles.actionItem}>
            <ShoppingCart size={20} strokeWidth={2} aria-hidden />
            <span className={styles.actionText}>
              <span className={styles.actionLabel}>Carrinho</span>
              <span className={styles.actionSub}>0 itens</span>
            </span>
          </Link>
        </div>
      </div>

      <nav className={`container ${styles.nav}`}>
        <button className={styles.categoriesButton} type="button">
          <Menu size={16} strokeWidth={2.25} aria-hidden />
          Categorias
        </button>
        <ul className={styles.navList}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
