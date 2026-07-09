import Link from "next/link";
import styles from "./Footer.module.css";

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
            <li>+55 (11) 94147-0245</li>
            <li>contato@portaloneinformatica.com</li>
            <li>São Paulo, SP - Brasil</li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.badges}`}>
        <span>🔒 Site Seguro</span>
        <span>🛡️ Compra Segura</span>
        <span>✅ Produtos com Garantia</span>
        <span>↩️ Devolução em 7 dias</span>
      </div>
    </footer>
  );
}
