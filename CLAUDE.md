# Portal One Informática — Site Novo (do zero)

## ⚠️ Regra mais importante
Este é um **projeto separado e isolado** do site WordPress atual (`Local Sites\portalone\`, tema `portalone-tema-v47`/`v46`/`v1`).
- **NÃO** editar, referenciar como dependência, ou reutilizar código do WordPress.
- **NÃO** mexer em nada dentro de `Local Sites\`, `temp_v2\`, `temp_restore*\` ou nos `.zip` do tema.
- O site WordPress está sendo mantido por **outro agente/sessão em paralelo**. Qualquer alteração cruzada pode causar conflito.
- Este projeto pode olhar o site WP atual (`portaloneinfo.com.br`) e os prints em `docs/reference-screenshots/` **apenas como referência visual/de conteúdo**, nunca como base técnica.

## O que é este projeto
Reconstrução completa do site institucional/e-commerce da **Portal One Informática**, do zero, **sem WordPress**. Stack técnica ainda **não definida** — será decidida quando o usuário mandar o prompt de arquitetura/planta.

## Status atual
- [x] Pasta do projeto criada
- [x] Documentação inicial (este arquivo, `docs/PRODUCT.md`, `docs/DESIGN-REFERENCE.md`)
- [ ] Definição de stack (aguardando prompt do usuário)
- [ ] Setup do projeto
- [ ] Implementação

## Skills instaladas relevantes para este projeto
- **impeccable** (`pbakaus/impeccable`) — usar para auditar/polir o design, evitar cara "genérica de IA". Rodar `/impeccable init` assim que o projeto novo tiver código, criando `PRODUCT.md`/`DESIGN.md` próprios do impeccable (não confundir com `docs/PRODUCT.md` deste handoff).
- **claude-mem** — memória entre sessões; usar para não perder contexto entre handoffs deste projeto.

## Próximos passos
1. Usuário vai enviar um **prompt-planta** (blueprint) descrevendo o que construir.
2. Analisar o prompt à luz do `docs/PRODUCT.md` e `docs/DESIGN-REFERENCE.md`.
3. Só então começar a construir — com stack a ser escolhida na hora, orientada pelo prompt.
