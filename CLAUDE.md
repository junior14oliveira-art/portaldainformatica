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

## Banco de dados local (SEM Docker por enquanto)
Por decisão do usuário, o Docker foi adiado (ele vai instalar depois). Para não travar o desenvolvimento, o **PostgreSQL 17 foi instalado nativamente no Windows** via `winget` (serviço `postgresql-x64-17`, rodando como serviço do Windows, sem precisar do Docker).

- Usuário/senha de dev: `portaldainformatica` / `portaldainformatica` (bate com `.env.example`)
- Banco: `portaldainformatica`, owner `portaldainformatica`, com permissão `CREATEDB` (necessária para o shadow database do `prisma migrate dev`)
- Autenticação do Postgres está em `scram-sha-256` (segura) — **nunca deixar em `trust`**. Se precisar de acesso admin de novo, usar o método temporário trust→revert (exige reiniciar o serviço 2x como Administrador, pois a sessão do agente não tem privilégio de admin no Windows) e sempre confirmar com o usuário antes.
- ⚠️ Ao editar `pg_hba.conf` no Windows, **nunca usar `Set-Content -Encoding utf8`** do PowerShell — ele escreve BOM UTF-8, que quebra o parser do Postgres e impede o serviço de iniciar. Usar `sed`/escrita sem BOM.
- Quando o Docker for instalado futuramente, migrar para `docker-compose.yml` (já existe na raiz do repo) e desativar o serviço nativo, ou manter os dois em portas diferentes — decidir com o usuário na hora.

## Status atual — Fase 1 (Infraestrutura) — CONCLUÍDA
- [x] Documentação completa lida e escopo confirmado com o usuário
- [x] Projeto Next.js + TypeScript criado (`app/`)
- [x] Estrutura de pastas enterprise criada (`components/`, `features/`, `services/`, `repositories/`, etc — ver `docs/02-ARQUITETURA.md`)
- [x] `docker-compose.yml` criado (Postgres, Redis, Mailpit, Adminer) — pronto para quando o Docker for instalado
- [x] PostgreSQL 17 nativo instalado e configurado (ver seção acima)
- [x] Prisma 7 configurado com `@prisma/adapter-pg` (schema + `prisma.config.ts` + `src/lib/prisma.ts`)
- [x] Migration inicial aplicada (`prisma/migrations/20260709181130_init`)
- [x] Seed rodado com sucesso (admin + 7 categorias + 3 marcas)
- [x] App validado rodando em `localhost:3000`
- [ ] Redis: ainda não configurado (depende do Docker ou de instalação nativa futura) — nenhum código depende dele ainda

## Skills/plugins disponíveis
- **impeccable** (`pbakaus/impeccable`) — auditar/polir o design. Rodar `/impeccable init` quando as primeiras telas existirem.
- **claude-mem** — memória entre sessões.

## Próximos passos (Fase 2 do roadmap — ver `docs/13-roadmap.md`)
1. Autenticação: Better Auth (login/cadastro/Google OAuth) — `docs/05-BACKEND.md` e `docs/12-seguraca.md`.
2. Camadas de repository/service para produtos e categorias.
3. Primeiras telas reais (Home, Categoria, Produto) usando `docs/06-FRONTEND.md` e `docs/10-desing system.md` como referência de design system — **não copiar o layout do WordPress atual**, só usar como referência de conteúdo.
