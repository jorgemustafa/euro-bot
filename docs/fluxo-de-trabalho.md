# Fluxo de trabalho

Este projeto usa `main` como branch estável e `develop` como branch de integração.

## Regra

Todo novo pedaço de código deve seguir:

1. Criar/usar branch de trabalho a partir de `develop`.
2. Implementar mudança pequena e testável.
3. Rodar validação mínima:
   - `npm test`
   - `npm run typecheck`
4. Commitar.
5. Abrir PR para `main`.
6. Só depois de aprovado/mergeado, atualizar `develop` com `main`.

## Para o Codex

- Não commitar direto em `main`, salvo pedido explícito.
- Sempre informar branch atual no resumo.
- Sempre citar testes executados.
- Para cada entrega de código, abrir PR para `main` quando houver ferramenta/auth disponível.
- Se PR não puder ser criado automaticamente, entregar link `compare` do GitHub.

## Branches

- `main`: produção/estado confiável.
- `develop`: integração local das próximas mudanças.
- `codex/*`: branches curtas para features/fixes.
