---
name: portaldainformatica-handoff
description: Handoff document para o projeto novo do site Portal One Informática, construído do zero (fora do WordPress).
---

# Portal One Informática — Site Novo (do zero) — Handoff

## Contexto
Este é um projeto **novo e isolado**, criado em `portaldainformatica/`, para reconstruir o site da Portal One Informática **sem WordPress**. Existe um site WordPress ativo (`Local Sites\portalone\`) sendo mantido por **outro agente em paralelo** — este projeto não deve tocar nele.

## O que já foi feito
1. Pasta do projeto criada: `portaldainformatica/`.
2. Documentação de negócio: [`docs/PRODUCT.md`](../../docs/PRODUCT.md) — quem é a empresa, produtos, público, diferenciais, estrutura de conteúdo do site atual.
3. Documentação de referência visual: [`docs/DESIGN-REFERENCE.md`](../../docs/DESIGN-REFERENCE.md) — análise dos prints do site WordPress atual (cores, seções, layout), usada **apenas como referência**, não como padrão a copiar.
4. `CLAUDE.md` na raiz do projeto com a regra de isolamento e status.

## O que falta (próximos passos)
1. **Aguardando prompt-planta do usuário** com o blueprint/arquitetura desejada.
2. A partir desse prompt: escolher a stack técnica (ainda não definida).
3. Rodar `/impeccable init` assim que houver estrutura de código, para gerar o design system próprio (cores, tipografia, tom) — não confundir com os docs de negócio já criados aqui.
4. Construir seguindo o prompt do usuário, usando `docs/PRODUCT.md` e `docs/DESIGN-REFERENCE.md` como contexto de negócio/conteúdo.

## Skills/plugins disponíveis para usar neste projeto
- **impeccable** — auditoria e polimento de design frontend.
- **claude-mem** — memória entre sessões deste projeto.

## Regra de ouro
Nunca editar, importar ou depender de arquivos do WordPress (`Local Sites\`, `temp_v2\`, `temp_restore*\`, `*.zip` de temas). Este projeto é 100% independente.
