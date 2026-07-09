import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Lock,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7h2.6l.4-3h-3V9.1c0-.9.3-1.5 1.6-1.5H16.6V4.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9V11H7.9v3h2.6v7h3Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import { COMPANY } from "@/constants/company";
import styles from "./Footer.module.css";

const BADGES = [
  { icon: Lock, label: "Site Seguro" },
  { icon: ShieldCheck, label: "Compra Segura" },
  { icon: BadgeCheck, label: "Produtos com Garantia" },
  { icon: RotateCcw, label: "Devolução em 7 dias" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <Image
            src="/institucional/logo.png"
            alt="Portal One Informática"
            width={158}
            height={59}
            className={styles.logo}
          />
          <p className={styles.description}>
            A Portal One Informática é especializada em locação e venda de
            equipamentos de informática adequados aos mais diferentes
            cenários corporativos.
          </p>
          <div className={styles.social}>
            <a
              href={COMPANY.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook da Portal One"
            >
              <FacebookIcon />
            </a>
            <a
              href={COMPANY.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Portal One"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>

        <div>
          <h3>Navegação</h3>
          <ul>
            <li><Link href="/">Início</Link></li>
            <li><Link href="/categoria/notebooks">Notebooks</Link></li>
            <li><Link href="/categoria/computadores">Computadores</Link></li>
            <li><Link href="/categoria/servidores">Servidores</Link></li>
            <li><Link href="/minha-conta">Minha Conta</Link></li>
          </ul>
        </div>

        <div>
          <h3>Institucional</h3>
          <ul>
            <li><Link href="/sobre">Sobre a Portal One</Link></li>
            <li><Link href="/faq">Perguntas Frequentes</Link></li>
            <li><Link href="/contato">Fale Conosco</Link></li>
            <li><Link href="/politica-de-trocas">Política de Trocas</Link></li>
            <li><Link href="/prazos-e-entregas">Prazos e Entregas</Link></li>
          </ul>
        </div>

        <div>
          <h3>Contato</h3>
          <ul>
            <li className={styles.contactItem}>
              <Phone size={16} strokeWidth={2} aria-hidden />
              <a href={COMPANY.phoneHref} title="Clique e ligue">
                {COMPANY.phone}
              </a>
            </li>
            <li className={styles.contactItem}>
              <Mail size={16} strokeWidth={2} aria-hidden />
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </li>
            <li className={styles.contactItem}>
              <MapPin size={16} strokeWidth={2} aria-hidden />
              <a
                href={COMPANY.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Ver no mapa"
              >
                {COMPANY.address}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.badges}`}>
        {BADGES.map(({ icon: Icon, label }) => (
          <span key={label} className={styles.badge}>
            <Icon size={16} strokeWidth={2} aria-hidden />
            {label}
          </span>
        ))}
      </div>
    </footer>
  );
}
