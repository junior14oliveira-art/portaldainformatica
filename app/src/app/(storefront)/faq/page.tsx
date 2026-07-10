import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { WHATSAPP_URL } from "@/constants/company";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description:
    "Tire suas dúvidas sobre locação e compra de computadores, notebooks e servidores com a Portal One Informática.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    question:
      "Quais equipamentos a Portal One disponibiliza para locação? Quais os períodos disponíveis?",
    answer:
      "Disponibilizamos computadores, notebooks e servidores Intel, preferencialmente HP e Dell ou manufaturados internamente. Possuímos estoque de diversas configurações e oferecemos customizações. Os períodos de locação são flexíveis: diária, semanal, mensal ou contratos de longo prazo de 12, 24 ou 36 meses.",
  },
  {
    question: "Como a locação pode economizar na minha empresa?",
    answer:
      "Preserva o capital de giro para investimentos, evitando o alto desembolso no ato da compra; o valor mensal pode ser abatido no IR como despesa; dispensa imobilização e depreciação do bem; inclui manutenção on-site com prazo de solução e troca de equipamento; e inclui instalação de sistema operacional e aplicativos ou replicação da imagem do cliente.",
  },
  {
    question: "Como a locação pode auxiliar o setor de informática?",
    answer:
      "Possibilita a atualização ou substituição dos equipamentos a qualquer momento do contrato, evitando a obsolescência tecnológica; oferece suporte técnico ágil em até 12 horas úteis; e permite contratos customizados conforme a necessidade de cada cliente: configuração, período de locação, atualização, entre outros.",
  },
  {
    question: "Por que escolher a Portal One?",
    answer:
      "Oferecemos o melhor produto com a qualidade e a performance que o cliente necessita, com baixo custo e benefício real para o dia a dia. Nossa equipe é qualificada para entender o que sua empresa precisa e garantir o melhor atendimento na venda e no pós-venda.",
  },
  {
    question: "Quais softwares já vêm instalados nos equipamentos?",
    answer:
      "Instalamos sistemas operacionais corporativos, servidores e aplicativos Microsoft e Linux. Imagens pré-configuradas dos clientes podem ser replicadas em todos os equipamentos alugados sem custo adicional. Por exemplo: desktops e notebooks podem vir com Windows 10 Pro e Office pré-instalados; servidores podem vir com Linux. Demais softwares Microsoft podem ser licenciados na locação, com instalação a cargo do cliente.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <div className={`container ${styles.page}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <header className={styles.header}>
        <h1>Perguntas frequentes</h1>
        <p>
          Tudo o que você precisa saber sobre locação e compra de
          equipamentos com a Portal One.
        </p>
      </header>

      <div className={styles.list}>
        {FAQS.map((faq) => (
          <details key={faq.question} className={styles.item}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>

      <aside className={styles.cta}>
        <p>Não encontrou sua resposta?</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={18} />
          Falar com a nossa equipe
        </a>
      </aside>
    </div>
  );
}
