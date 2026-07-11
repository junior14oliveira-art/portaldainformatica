import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { Heart, Search, ShieldCheck, ShoppingCart, Truck, User, Zap } from "lucide-react";
import { peekCartSessionId } from "@/lib/cart-session";
import { getCartItemCount } from "@/services/cart-service";
import { getWishlistCount } from "@/services/wishlist-service";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CategoriesMenu } from "@/components/layout/CategoriesMenu";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Computadores", href: "/categoria/computadores" },
  { label: "Notebooks", href: "/categoria/notebooks" },
  { label: "Acessórios", href: "/categoria/acessorios" },
  { label: "Hardware", href: "/categoria/hardware" },
  { label: "Servidores", href: "/categoria/servidores" },
];

const SECONDARY_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Sobre", href: "/sobre" },
  { label: "FAQ", href: "/faq" },
];

const TOPBAR_ITEMS = [
  { icon: Zap, label: "Pague no PIX com segurança" },
  { icon: ShieldCheck, label: "Equipamentos com garantia" },
  { icon: Truck, label: "Entrega para todo o Brasil" },
];

export async function Header() {
  const sessionId = await peekCartSessionId();
  const cartCount = sessionId ? await getCartItemCount(sessionId) : 0;
  const session = await auth.api.getSession({ headers: await headers() });
  const wishlistCount = session ? await getWishlistCount(session.user.id) : 0;
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true },
  });

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

      <div className={styles.main}>
        <div className={`container ${styles.mainInner}`}>
          <Link href="/" className={styles.logo} title="Home - Portal One Informática">
            <Image
              src="/institucional/logo.png"
              alt="Portal One Informática"
              width={177}
              height={67}
              priority
            />
          </Link>

          <form className={styles.search} role="search" action="/busca">
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
            <Link
              href={session ? "/minha-conta" : "/entrar"}
              className={styles.actionItem}
            >
              <User size={20} strokeWidth={2} aria-hidden />
              <span className={styles.actionText}>
                <span className={styles.actionLabel}>
                  {session ? session.user.name || "Minha conta" : "Minha conta"}
                </span>
                <span className={styles.actionSub}>
                  {session ? "Ver perfil" : "Entrar / Cadastro"}
                </span>
              </span>
            </Link>
            <Link href="/favoritos" className={styles.actionItem}>
              <span className={styles.cartIconWrapper}>
                <Heart size={20} strokeWidth={2} aria-hidden />
                {wishlistCount > 0 ? (
                  <span className={styles.cartBadge}>{wishlistCount}</span>
                ) : null}
              </span>
              <span className={styles.actionText}>
                <span className={styles.actionLabel}>Favoritos</span>
                <span className={styles.actionSub}>
                  {wishlistCount} {wishlistCount === 1 ? "item" : "itens"}
                </span>
              </span>
            </Link>
            <Link href="/carrinho" className={styles.actionItem}>
              <span className={styles.cartIconWrapper}>
                <ShoppingCart size={20} strokeWidth={2} aria-hidden />
                {cartCount > 0 ? (
                  <span className={styles.cartBadge}>{cartCount}</span>
                ) : null}
              </span>
              <span className={styles.actionText}>
                <span className={styles.actionLabel}>Carrinho</span>
                <span className={styles.actionSub}>
                  {cartCount} {cartCount === 1 ? "item" : "itens"}
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <CategoriesMenu categories={categories} />
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <ul className={styles.navSecondary}>
            {SECONDARY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
