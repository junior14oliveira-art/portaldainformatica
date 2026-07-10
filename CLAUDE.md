# Portal One Informática — Site Novo (do zero)

## ⚠️ Regra mais importante
Este é um **projeto separado e isolado** do site WordPress atual (`Local Sites\portalone\`, tema `portalone-tema-v47`/`v46`/`v1`).
- **NÃO** editar, referenciar como dependência, ou reutilizar código do WordPress.
- **NÃO** mexer em nada dentro de `Local Sites\`, `temp_v2\`, `temp_restore*\` ou nos `.zip` do tema.
- O site WordPress está sendo mantido por **outro agente/sessão em paralelo**. Qualquer alteração cruzada pode causar conflito.
- O site WP atual (`portaloneinfo.com.br`) e os prints analisados em `docs/DESIGN-REFERENCE.md` servem **apenas como referência visual/de conteúdo**, nunca como base técnica.

## ⚠️ Onde o código vive
O **código-fonte deste projeto roda localmente em `C:\Users\EMPRESA\source\repos\portaldainformatica`**, fora do Google Drive.
- Motivo: a pasta original (`G:\Meu Drive\BACKUP2\portaldainformatica`) é sincronizada pelo Google Drive, o que deixou `npm install`/scaffold extremamente lentos (I/O de sincronização).
- A cópia em `G:\Meu Drive\BACKUP2\portaldainformatica` continua existindo com a documentação (`docs/`, `skills/`), mas **não é mais atualizada com código** — o repositório Git (GitHub) é a fonte da verdade.
- Repositório remoto: https://github.com/junior14oliveira-art/portaldainformatica

## O que é este projeto
E-commerce enterprise para a **Portal One Informática**, construído do zero, **sem WordPress**, seguindo o "Claude Code Master Guide" em `docs/00-VISAO-GERAL.md` a `docs/13-roadmap.md`.

## ⚠️ Comentários em código: português (instrução permanente)
O usuário pediu que o código tenha comentários em português. Aplicar em **código novo** daqui pra frente (repositories, services, actions, e onde houver uma decisão não-óbvia). Não é necessário voltar e re-comentar tudo que já existe, mas qualquer arquivo novo ou edição relevante deve seguir isso. Comentários continuam curtos e só onde agregam (explicar o "porquê", não o "o quê" — ver seção de estilo de código do sistema).

## ⚠️ Integrações via "plugins" (estilo WooCommerce) — decisão de arquitetura pendente
O usuário quer que integrações como **Mercado Pago, Correios, Melhor Envio etc.** funcionem como plugins/módulos plugáveis, no estilo dos plugins do WooCommerce — não hardcoded direto no core. Ainda não implementado. Quando for arquitetar isso, considerar:
- Uma pasta `src/integrations/<nome>/` por integração, cada uma expondo uma interface comum (ex: `ShippingProvider` com `calculate()`, `PaymentProvider` com `createCharge()`/`handleWebhook()`).
- `shipping-service.ts` e o pagamento do checkout já isolam a lógica em arquivos próprios (`shipping-service.ts`, seção de pagamento em `order-service.ts`) — é o ponto de partida natural para virar interface plugável.
- Não superengenheirar antes de ter pelo menos 2 integrações reais implementadas (Mercado Pago real + 1 outra) — aí sim extrair o padrão comum.

## Editor visual para o admin (estilo Wix) — INICIADO (base funcional pronta)
O usuário quer que o administrador **edite o visual do site** com drag-and-drop estilo Wix. Decisão dele (2026-07-10): construtor completo, não versão simples. **Base já construída** usando **Puck** (`@measured/puck`, compatível com React 19):
- **Model `Page`** guarda o layout de blocos em JSON (`data`). Migration `add_page_builder`.
- **`src/lib/puck/config.tsx`**: define os blocos disponíveis (Hero, Título, Parágrafo, Imagem, Botão, Espaçamento, Cards de destaque), todos em português e estilizados com os design tokens da loja. **Para adicionar um bloco novo, é aqui.**
- **Admin**: `/admin/paginas` (lista/cria/exclui), `/admin/paginas/[id]` (editor Puck em tela cheia). O botão "Publish" do Puck chama `savePageAction`.
- **Público**: `/p/[slug]` renderiza via `PuckRenderer` (client component — o `Render` do Puck usa contexto). Com metadata/canonical/OG + entra no sitemap quando publicada.
- **Notas técnicas**: (1) o pacote `@measured/puck` está deprecado em favor de `@puckeditor/core` — funciona igual, migrar quando conveniente. (2) O screenshot do preview dá timeout na página do editor e na `/p/[slug]` (Puck carrega assets pesados) — validar por `get_page_text`/`read_page`, não screenshot. (3) Upload de imagem no editor ainda é por URL (campo de texto); integrar Cloudflare R2 depois.
- **Próximos incrementos**: mais blocos (grade de produtos dinâmica puxando do banco, vídeo, FAQ), upload de imagem direto, e opção de montar a própria Home pelo editor.

## ⚠️ SEO é prioridade máxima (instrução permanente do usuário)
O usuário deixou explícito que **SEO/performance no Google é a parte mais importante do projeto**, acima até do design. Isso vale para **toda construção futura**, não só o que já foi feito:
- Toda página nova precisa de: `title`/`description` únicos, `alternates.canonical`, Open Graph.
- Toda entidade nova que apareça publicamente (produto, categoria, post) precisa aparecer no `sitemap.ts` e, se fizer sentido, ganhar JSON-LD (`docs/11-seo.md` lista os tipos: Product, BreadcrumbList, FAQPage, Article, LocalBusiness etc).
- Rotas privadas (carrinho, checkout, conta, pedidos, auth) sempre `robots: { index: false }` — já configurado, mas replicar em toda página nova desse tipo.
- Performance: usar sempre `next/image` com `sizes` corretos, evitar JS desnecessário em Client Components, preferir Server Components sempre que possível.
- Antes de considerar qualquer feature "pronta", perguntar: isso ajuda ou atrapalha o SEO?

## Stack definida (ver `docs/02-ARQUITETURA.md`)
Next.js (App Router) + React + TypeScript + Prisma ORM + PostgreSQL + Redis + Better Auth + Mercado Pago + Melhor Envio + Cloudflare R2 + Resend + Sentry + Vercel. Docker Compose para ambiente local (Postgres, Redis, Mailpit, Adminer).

**Nota Prisma 7:** o schema não aceita mais `url` no bloco `datasource` — a conexão fica em `app/prisma.config.ts` (usa `@prisma/adapter-pg`). Ver esse arquivo antes de mexer em configuração de banco.

**Nota Next.js 16:** versão mais recente que o treinamento base do Claude — antes de usar APIs novas do App Router, consultar `app/node_modules/next/dist/docs/` (bundlado localmente).

## Banco de dados local (SEM Docker por enquanto)
Por decisão do usuário, o Docker foi adiado (ele vai instalar depois). Para não travar o desenvolvimento, o **PostgreSQL 17 foi instalado nativamente no Windows** via `winget` (serviço `postgresql-x64-17`, rodando como serviço do Windows, sem precisar do Docker).

- Usuário/senha de dev: `portaldainformatica` / `portaldainformatica` (bate com `.env.example`)
- Banco: `portaldainformatica`, owner `portaldainformatica`, com permissão `CREATEDB` (necessária para o shadow database do `prisma migrate dev`)
- Autenticação do Postgres está em `scram-sha-256` (segura) — **nunca deixar em `trust`**. Se precisar de acesso admin de novo, usar o método temporário trust→revert (exige reiniciar o serviço 2x como Administrador, pois a sessão do agente não tem privilégio de admin no Windows) e sempre confirmar com o usuário antes.
- ⚠️ Ao editar `pg_hba.conf` no Windows, **nunca usar `Set-Content -Encoding utf8`** do PowerShell — ele escreve BOM UTF-8, que quebra o parser do Postgres e impede o serviço de iniciar. Usar `sed`/escrita sem BOM.
- Quando o Docker for instalado futuramente, migrar para `docker-compose.yml` (já existe na raiz do repo) e desativar o serviço nativo, ou manter os dois em portas diferentes — decidir com o usuário na hora.

## Status atual

### Fase 1 (Infraestrutura) — CONCLUÍDA
- [x] Next.js 16 + TypeScript, estrutura de pastas enterprise (`components/`, `features/`, `services/`, `repositories/`, etc)
- [x] PostgreSQL 17 nativo instalado (ver seção acima) + Prisma 7 (`@prisma/adapter-pg`)
- [x] `docker-compose.yml` pronto para quando o Docker for instalado (Postgres/Redis/Mailpit/Adminer)
- [ ] Redis: ainda não configurado — nenhum código depende dele ainda

### Fase 2 (Identidade visual/conteúdo real) — CONCLUÍDA
- [x] Design tokens (cores, tipografia Inter, espaçamento) em `globals.css`
- [x] Conteúdo e identidade extraídos do zip do site institucional real (`portaloneinformatica.com`): logo, banners, textos de Sobre/FAQ/Serviços, contatos reais — ver commit "Integra identidade e conteudo do site institucional real"
- [x] Header, Footer, Home, `/sobre`, `/faq` com conteúdo real (não mais placeholder)
- [x] Ícones: `lucide-react` (nota: **não tem ícones de marca** tipo Facebook/Instagram desde a v1.24 — usar SVG inline, como em `Footer.tsx`)

### Fase 3 (Autenticação) — CONCLUÍDA
- [x] Better Auth integrado ao model `User` existente (não criou tabela de usuário separada — ver `docs/12-seguraca.md`: "nunca criar autenticação própria")
- [x] `src/lib/auth.ts` (config), `src/lib/auth-client.ts` (client + `inferAdditionalFields`), route handler em `/api/auth/[...all]`
- [x] Páginas `/entrar`, `/cadastro`, `/minha-conta` (protegida via `auth.api.getSession` + redirect)
- [x] Header reflete sessão real (nome do usuário vs "Entrar/Cadastro")
- [ ] Google OAuth: código pronto mas condicional — falta `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` no `.env`

### Fase 4 (Loja — parcial) — EM ANDAMENTO
- [x] Home, página de Categoria (com filtro de marca + ordenação), página de Produto (buy box)
- [x] Carrinho de compras completo: sessão de convidado via cookie (`src/lib/cart-session.ts`), repository/service/actions em camadas, drawer não implementado — usa página `/carrinho` cheia
- [x] Busca funcional: `/busca?q=` (GET nativo do form), busca por nome/descrição/SKU/marca, `noindex` (resultado de busca não deve ser indexado)
- [x] Dropdown de categorias no Header (`CategoriesMenu`, client component)
- [x] Avaliações (`Review`, com AggregateRating no JSON-LD) e Perguntas (`Question`) de produto — moderação no admin (`/admin/avaliacoes`, `/admin/perguntas`)
- [ ] Wishlist, comparador: ainda não implementados

### Fase 5 (Checkout) — CONCLUÍDA (com 2 pontos SIMULADOS)
- [x] `/checkout`: endereço (cadastro real, model `Address`) → frete → pagamento → resumo com total ao vivo
- [x] `src/services/shipping-service.ts`: cálculo de frete **SIMULADO** (PAC/SEDEX por estado) — falta trocar pela API real do Melhor Envio (precisa `MELHOR_ENVIO_TOKEN`)
- [x] Pedido real gravado no banco: `Order` + `OrderItem` + `Payment` + reserva de estoque (`InventoryMovement`) em uma transação Prisma — `src/services/order-service.ts`
- [x] `/pedido/[id]`: confirmação do pedido + botão **"Simular pagamento aprovado"** — falta trocar pela integração real do Mercado Pago (webhook assíncrono aprovaria automaticamente; precisa `MERCADO_PAGO_ACCESS_TOKEN`)
- [x] Login agora aceita `?callbackURL=`, então checkout → login → volta pro checkout funciona
- [x] Carrinho de convidado (`CartItem.sessionId`) associado ao usuário só no momento do pedido — hoje o pedido exige login (redirect pra `/entrar`)

### Fase 8 (SEO técnico) — BASE CONCLUÍDA (ver seção de prioridade acima)
- [x] `sitemap.xml` dinâmico (produtos, categorias, páginas institucionais)
- [x] `robots.txt` (bloqueia rotas privadas, aponta pro sitemap)
- [x] `metadataBase` + Open Graph + Twitter Card globais
- [x] JSON-LD: Organization + WebSite (global), Product + Offer + Brand + BreadcrumbList (produto), BreadcrumbList (categoria), FAQPage (faq)
- [x] Canonical URL em todas as páginas públicas
- [ ] Google Search Console / GA4: ainda não configurado (falta `NEXT_PUBLIC_GA4_ID`)
- [ ] Core Web Vitals: ainda não medido/otimizado formalmente (Lighthouse)

### Fase 6 (Painel Admin) — CONCLUÍDA (núcleo)
- [x] `/admin` com RBAC real (`src/lib/admin-guard.ts` — só ADMIN/MANAGER, redirect senão)
- [x] Layout próprio (sidebar + topbar), sem Header/Footer da loja — rotas públicas movidas para `src/app/(storefront)/`
- [x] Dashboard com métricas reais (receita, pedidos, clientes, mais vendidos)
- [x] Produtos: listagem+busca, criar/editar (slug automático), desativar
- [x] Pedidos: listagem+filtro por status, detalhe com troca de status inline
- [x] Categorias/Marcas/Clientes: listagens
- [x] Avaliações: moderação (publicar/ocultar)
- [x] Blog: CRUD completo (`/admin/blog`) + páginas públicas `/blog` e `/blog/[slug]` com JSON-LD BlogPosting
- [x] Usuários/RBAC: `/admin/usuarios` (trocar papel, com trava de auto-edição)
- [ ] Cupons, cashback, banners: ainda não têm admin (schema já existe)
- [ ] Editor visual estilo Wix: **NÃO iniciado** — ver seção própria acima, é um projeto grande à parte

### Fases 7, 9-13 (integrações reais, performance, qualidade, produção) — NÃO INICIADAS
Ver `docs/13-roadmap.md` para detalhes de cada fase.

## O que está simulado (não é bug — é o que falta de credenciais reais)
- **Frete**: `shipping-service.ts` retorna valores fixos por estado. Trocar por chamada real ao Melhor Envio quando houver token.
- **Pagamento**: não há gateway real conectado. O botão "Simular pagamento aprovado" existe só para permitir testar o fluxo completo sem sair do dev. Em produção, isso vira um webhook do Mercado Pago chamando `simulatePaymentApproval` (renomear/mover para `webhook-service` na hora).
- **Google OAuth**: código pronto, só falta `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`.

## Skills/plugins disponíveis
- **impeccable** (`pbakaus/impeccable`) — hook automático já roda a cada Write/Edit de arquivo de UI e reporta findings de design. Rodar `/impeccable init` para gerar `PRODUCT.md`/`DESIGN.md` próprios ainda não foi feito.
- **claude-mem** — memória entre sessões.

## Próximos passos sugeridos
1. Incrementar o construtor visual (ver seção acima): bloco de grade de produtos dinâmica, upload de imagem via R2, mais blocos.
2. Admin de Cupons/Cashback/Banners (schema já existe, falta CRUD — Blog e Usuários já foram feitos).
3. Arquitetura de integrações plugáveis (Mercado Pago/Correios/Melhor Envio como "plugins" — ver seção acima) quando houver credenciais reais de sandbox.
4. Lighthouse audit formal (Performance/SEO/A11y/Best Practices) quando o site tiver mais conteúdo real.
5. Wishlist e comparador de produtos (schema `WishlistItem` já existe para wishlist).
