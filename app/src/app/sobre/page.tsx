import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Gem, Target } from "lucide-react";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça a Portal One Informática: empresa fundada em 2021, especializada em locação e venda de equipamentos de informática para cenários corporativos.",
};

const VALUES = [
  {
    icon: Target,
    title: "Missão",
    text: "Estabelecer-se como líder em locação de equipamentos e prestação de serviços em informática, prezando pela excelência no atendimento, qualidade nos equipamentos e tecnologia de forma personalizada.",
  },
  {
    icon: Eye,
    title: "Visão",
    text: "Ser a maior empresa de locação de equipamentos e prestação de serviços em informática no Brasil, reconhecida por clientes, colaboradores e fornecedores como a melhor opção em qualidade e relacionamento.",
  },
  {
    icon: Gem,
    title: "Valores",
    text: "Valorizamos a ética, transparência, comprometimento, inovação tecnológica e sustentabilidade — tanto com nossos clientes quanto na forma de executarmos nosso trabalho.",
  },
];

export default function SobrePage() {
  return (
    <div className={styles.page}>
      <section className={styles.banner}>
        <Image
          src="/institucional/banners/conheca.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.bannerImage}
          aria-hidden
        />
        <div className={`container ${styles.bannerInner}`}>
          <h1>Conheça a Portal One</h1>
          <p>
            Especialistas em locação e venda de equipamentos de informática
            para todos os tipos de empresa.
          </p>
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.about}>
          <div>
            <h2>Quem somos</h2>
            <p>
              A Portal One Informática é uma empresa especializada em locação
              de equipamentos de informática adequados aos mais diferentes
              cenários corporativos. Com uma equipe altamente especializada e
              qualificada, oferecemos serviços com proatividade e suporte
              remoto, telefônico e on-site para atender nossos clientes com
              excelência — gerando a melhor relação custo/benefício do
              mercado.
            </p>
            <p>
              Priorizamos a eficiência e a inovação, auxiliando na otimização
              de processos, na melhoria de resultados e na redução de custos,
              permitindo que o foco do cliente seja direcionado ao seu
              negócio.
            </p>
          </div>
          <div className={styles.aboutMedia}>
            <Image
              src="/institucional/sobre.jpg"
              alt="Equipe da Portal One Informática"
              fill
              sizes="(max-width: 900px) 100vw, 440px"
              className={styles.aboutImage}
            />
          </div>
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <h2>Nossa história</h2>
        <div className={styles.history}>
          <p>
            A Portal One Informática foi fundada em 2021 com o objetivo de
            fornecer tecnologia a pequenas, médias e grandes empresas —
            alavancando vendas e reduzindo custos com equipamentos que se
            adequam às necessidades de cada perfil, sempre com qualidade e
            flexibilidade.
          </p>
          <p>
            Com base em pesquisas de mercado e na crescente demanda por
            locação de equipamentos, percebemos a necessidade das empresas de
            buscar na informática maneiras de aprimorar processos, obter
            melhores resultados e ter maior controle sobre a organização.
          </p>
          <p>
            Desde a fundação, a Portal One vem consolidando parcerias de
            sucesso com grandes empresas de diferentes segmentos. Seja um
            parceiro Portal One e faça parte dessa história!
          </p>
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.values}>
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div key={title} className={styles.valueCard}>
              <Icon size={26} strokeWidth={1.75} aria-hidden />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
