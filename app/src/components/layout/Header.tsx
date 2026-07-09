import Link from "next/link";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Computadores", href: "/categoria/computadores" },
  { label: "Notebooks", href: "/categoria/notebooks" },
  { label: "Acessórios", href: "/categoria/acessorios" },
  { label: "Hardware", href: "/categoria/hardware" },
  { label: "Servidores", href: "/categoria/servidores" },
];

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topbar}>
        <div className={`container ${styles.topbarInner}`}>
          <span>⚡ Pague no PIX com segurança</span>
          <span>🛡️ Equipamentos com garantia</span>
          <span>🚚 Entrega para todo o Brasil</span>
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
            🔍
          </button>
        </form>

        <div className={styles.actions}>
          <Link href="/minha-conta" className={styles.actionItem}>
            <span className={styles.actionLabel}>Minha conta</span>
            <span className={styles.actionSub}>Entrar / Cadastro</span>
          </Link>
          <Link href="/carrinho" className={styles.actionItem}>
            <span className={styles.actionLabel}>🛒 Carrinho</span>
            <span className={styles.actionSub}>0 itens</span>
          </Link>
        </div>
      </div>

      <nav className={`container ${styles.nav}`}>
        <button className={styles.categoriesButton} type="button">
          ☰ Categorias
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
