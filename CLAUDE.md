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

## Stack definida (ver `docs/02-ARQUITETURA.md`)
Next.js (App Router) + React + TypeScript + Prisma ORM + PostgreSQL + Redis + Better Auth + Mercado Pago + Melhor Envio + Cloudflare R2 + Resend + Sentry + Vercel. Docker Compose para ambiente local (Postgres, Redis, Mailpit, Adminer).

**Nota Prisma 7:** o schema não aceita mais `url` no bloco `datasource` — a conexão fica em `app/prisma.config.ts` (usa `@prisma/adapter-pg`). Ver esse arquivo antes de mexer em configuração de banco.

**Nota Next.js 16:** versão mais recente que o treinamento base do Claude — antes de usar APIs novas do App Router, consultar `app/node_modules/next/dist/docs/` (bundlado localmente).

## Status atual — Fase 1 (Infraestrutura)
- [x] Documentação completa lida e escopo confirmado com o usuário
- [x] Projeto Next.js + TypeScript criado (`app/`)
- [x] Estrutura de pastas enterprise criada (`components/`, `features/`, `services/`, `repositories/`, etc — ver `docs/02-ARQUITETURA.md`)
- [x] `docker-compose.yml` criado (Postgres, Redis, Mailpit, Adminer) — **ainda não testado**, aguardando Docker Desktop
- [x] Prisma inicializado com schema base (`app/prisma/schema.prisma`) cobrindo usuários, catálogo, estoque, carrinho, pedidos, pagamentos, avaliações, cupons, cashback, banners, blog e auditoria
- [x] `npx prisma generate` validado sem banco
- [x] App validado rodando em `localhost` (`npm run dev`)
- [ ] **Pendente:** usuário está instalando o Docker Desktop (precisa reiniciar o PC) — assim que pronto, rodar `docker compose up -d` + `npx prisma migrate dev` + seed
- [ ] Fase 2 em diante: ver `docs/13-roadmap.md`

## Skills/plugins disponíveis
- **impeccable** (`pbakaus/impeccable`) — auditar/polir o design. Rodar `/impeccable init` quando as primeiras telas existirem.
- **claude-mem** — memória entre sessões.

## Próximos passos
1. Usuário termina de instalar o Docker Desktop e reinicia o PC.
2. Rodar `docker compose up -d` na raiz do repositório local.
3. Rodar `npx prisma migrate dev --name init` dentro de `app/`.
4. Criar seed inicial (`prisma/seed.ts`) com dados de exemplo.
5. Seguir para Fase 2 do roadmap (banco de dados/autenticação) — ver `docs/13-roadmap.md`.
