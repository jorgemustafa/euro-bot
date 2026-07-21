# WhatsApp

Opção recomendada: WhatsApp Business Cloud API oficial.

Fluxo:

```txt
WhatsApp -> webhook -> parser/LLM -> booking engine -> Appium -> app Euroville
```

Exemplos:

```txt
reservar quadra areia 1 amanhã 17h
```

Resposta esperada:

```txt
Achei QUADRA AREIA 01 em 22/07 às 17:00. Responda SIM para confirmar.
```

Se indisponível:

```txt
17:00 indisponível. Próximos disponíveis: 16:00, 18:00.
```

Notas:

- Evitar automação de WhatsApp Web.
- Webhook precisa HTTPS público.
- Mensagens fora janela de 24h podem exigir template aprovado.

Referência:

- https://developers.facebook.com/docs/whatsapp/cloud-api/overview

