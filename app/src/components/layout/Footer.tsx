import Link from "next/link";
import { Lock, Mail, MapPin, Phone, RotateCcw, ShieldCheck, BadgeCheck } from "lucide-react";
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
          <div className={styles.logo}>
            Portal <strong>One</strong>
          </div>
          <p className={styles.description}>
            A Portal One Informática é especializada em locação e venda de
            equipamentos de informática adequados aos mais diferentes
            cenários corporativos.
          </p>
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
          <h3>Atendimento</h3>
          <ul>
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
              +55 (11) 94147-0245
            </li>
            <li className={styles.contactItem}>
              <Mail size={16} strokeWidth={2} aria-hidden />
              contato@portaloneinformatica.com
            </li>
            <li className={styles.contactItem}>
              <MapPin size={16} strokeWidth={2} aria-hidden />
              São Paulo, SP - Brasil
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
