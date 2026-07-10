import type { Config } from "@measured/puck";
import styles from "./blocks.module.css";

// Configuracao do editor visual (Puck). Cada bloco define os campos
// editaveis no painel e como renderiza. Os estilos vem dos design tokens
// da loja (blocks.module.css) para as paginas montadas ficarem coerentes.

type HeroProps = {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  buttonLabel?: string;
  buttonLink?: string;
};

type HeadingProps = { text: string; level: "h1" | "h2" | "h3"; align: "left" | "center" };
type TextProps = { text: string; align: "left" | "center" };
type ImageProps = { src: string; alt: string };
type ButtonProps = { label: string; link: string; variant: "primary" | "dark" | "outline" };
type SpacerProps = { size: "small" | "medium" | "large" };
type FeatureCardsProps = {
  cards: { icon: string; title: string; text: string }[];
};

const SPACER_SIZES: Record<SpacerProps["size"], string> = {
  small: "24px",
  medium: "48px",
  large: "80px",
};

export type PuckComponents = {
  Hero: HeroProps;
  Heading: HeadingProps;
  Text: TextProps;
  Image: ImageProps;
  Button: ButtonProps;
  Spacer: SpacerProps;
  FeatureCards: FeatureCardsProps;
};

export const puckConfig: Config<PuckComponents> = {
  components: {
    Hero: {
      label: "Banner (Hero)",
      fields: {
        title: { type: "text", label: "Título" },
        subtitle: { type: "textarea", label: "Subtítulo" },
        backgroundImage: { type: "text", label: "URL da imagem de fundo" },
        buttonLabel: { type: "text", label: "Texto do botão" },
        buttonLink: { type: "text", label: "Link do botão" },
      },
      defaultProps: {
        title: "Título do banner",
        subtitle: "Escreva aqui um subtítulo persuasivo.",
        buttonLabel: "Saiba mais",
        buttonLink: "/",
      },
      render: ({ title, subtitle, backgroundImage, buttonLabel, buttonLink }) => (
        <section className={styles.hero}>
          {backgroundImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={styles.heroBg} src={backgroundImage} alt="" />
          ) : null}
          <div className={`container ${styles.heroInner}`}>
            <h1 className={styles.heroTitle}>{title}</h1>
            <p className={styles.heroSubtitle}>{subtitle}</p>
            {buttonLabel ? (
              <a
                className={`${styles.button} ${styles.buttonPrimary}`}
                href={buttonLink || "/"}
              >
                {buttonLabel}
              </a>
            ) : null}
          </div>
        </section>
      ),
    },

    Heading: {
      label: "Título",
      fields: {
        text: { type: "text", label: "Texto" },
        level: {
          type: "select",
          label: "Nível",
          options: [
            { label: "H1 (maior)", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
          ],
        },
        align: {
          type: "select",
          label: "Alinhamento",
          options: [
            { label: "Esquerda", value: "left" },
            { label: "Centro", value: "center" },
          ],
        },
      },
      defaultProps: { text: "Novo título", level: "h2", align: "left" },
      render: ({ text, level, align }) => {
        const Tag = level;
        const size = level === "h1" ? "2.5rem" : level === "h2" ? "1.875rem" : "1.375rem";
        return (
          <div className="container">
            <Tag className={styles.heading} style={{ fontSize: size, textAlign: align }}>
              {text}
            </Tag>
          </div>
        );
      },
    },

    Text: {
      label: "Parágrafo",
      fields: {
        text: { type: "textarea", label: "Texto" },
        align: {
          type: "select",
          label: "Alinhamento",
          options: [
            { label: "Esquerda", value: "left" },
            { label: "Centro", value: "center" },
          ],
        },
      },
      defaultProps: { text: "Escreva o conteúdo do parágrafo aqui.", align: "left" },
      render: ({ text, align }) => (
        <div className="container">
          <p className={styles.text} style={{ textAlign: align }}>
            {text}
          </p>
        </div>
      ),
    },

    Image: {
      label: "Imagem",
      fields: {
        src: { type: "text", label: "URL da imagem" },
        alt: { type: "text", label: "Texto alternativo (SEO)" },
      },
      defaultProps: { src: "", alt: "" },
      render: ({ src, alt }) =>
        src ? (
          <div className="container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.image} src={src} alt={alt} />
          </div>
        ) : (
          <div className="container">
            <p className={styles.text}>Adicione a URL de uma imagem.</p>
          </div>
        ),
    },

    Button: {
      label: "Botão",
      fields: {
        label: { type: "text", label: "Texto" },
        link: { type: "text", label: "Link" },
        variant: {
          type: "select",
          label: "Estilo",
          options: [
            { label: "Primário (verde)", value: "primary" },
            { label: "Escuro", value: "dark" },
            { label: "Contorno", value: "outline" },
          ],
        },
      },
      defaultProps: { label: "Clique aqui", link: "/", variant: "primary" },
      render: ({ label, link, variant }) => {
        const variantClass =
          variant === "dark"
            ? styles.buttonDark
            : variant === "outline"
              ? styles.buttonOutline
              : styles.buttonPrimary;
        return (
          <div className="container">
            <a className={`${styles.button} ${variantClass}`} href={link || "/"}>
              {label}
            </a>
          </div>
        );
      },
    },

    Spacer: {
      label: "Espaçamento",
      fields: {
        size: {
          type: "select",
          label: "Tamanho",
          options: [
            { label: "Pequeno", value: "small" },
            { label: "Médio", value: "medium" },
            { label: "Grande", value: "large" },
          ],
        },
      },
      defaultProps: { size: "medium" },
      render: ({ size }) => <div style={{ height: SPACER_SIZES[size] }} />,
    },

    FeatureCards: {
      label: "Cards de destaque",
      fields: {
        cards: {
          type: "array",
          label: "Cards",
          arrayFields: {
            icon: { type: "text", label: "Ícone (emoji)" },
            title: { type: "text", label: "Título" },
            text: { type: "textarea", label: "Texto" },
          },
          defaultItemProps: { icon: "⭐", title: "Título", text: "Descrição do card." },
        },
      },
      defaultProps: {
        cards: [
          { icon: "🚚", title: "Entrega nacional", text: "Enviamos para todo o Brasil." },
          { icon: "🛡️", title: "Garantia", text: "Todos os produtos com garantia." },
          { icon: "⚡", title: "PIX", text: "Pague com desconto no PIX." },
        ],
      },
      render: ({ cards }) => (
        <div className="container">
          <div
            className={styles.columns}
            style={{ gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))` }}
          >
            {cards.map((card, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardIcon}>{card.icon}</div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardText}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  },
};
