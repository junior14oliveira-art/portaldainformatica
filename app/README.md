# Portal One Informática — App

E-commerce enterprise construído com Next.js (App Router) + TypeScript + Prisma + PostgreSQL.

> Ver documentação completa do projeto em [`../docs`](../docs) e regras gerais em [`../CLAUDE.md`](../CLAUDE.md).

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19 + TypeScript
- Prisma ORM 7 + PostgreSQL
- Zod, React Hook Form, TanStack Query, Framer Motion

## Pré-requisitos

- Node.js 20+
- Docker Desktop (para Postgres/Redis/Mailpit locais)

## Como rodar localmente

```bash
# 1. Subir serviços de banco/cache (na raiz do repositório, um nível acima de app/)
cd ..
docker compose up -d

# 2. Instalar dependências
cd app
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env

# 4. Rodar migrations e seed
npx prisma migrate dev
npx prisma db seed

# 5. Rodar o app
npm run dev
```

Acessar: http://localhost:3000

## Estrutura

```
app/
  src/
    app/          # rotas (App Router)
    components/   # ui, layout, product, cart, checkout, account
    features/
    hooks/
    contexts/
    providers/
    services/
    repositories/
    lib/
    utils/
    validators/
    schemas/
    types/
    constants/
    styles/
  prisma/         # schema.prisma, migrations
  tests/
  scripts/
  emails/
```

## Status

Fase 1 (Infraestrutura) em andamento — ver roadmap completo em [`../docs/13-roadmap.md`](../docs/13-roadmap.md).
