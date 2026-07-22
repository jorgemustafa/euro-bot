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

Lembrete:

```txt
Lembrete: sua reserva CAMPO SOCIETY começa em 1h, hoje às 17:00.
```

Notas:

- Evitar automação de WhatsApp Web.
- Webhook precisa HTTPS público.
- Mensagens fora janela de 24h podem exigir template aprovado.
- Para lembrete ativo, usar template aprovado se estiver fora da janela de atendimento.

## Estado atual

Já existe base local para:

- interpretar mensagens simples como `reservar quadra areia 1 as 17h`;
- enviar texto via WhatsApp Cloud API quando `.env` estiver configurado;
- usar WhatsApp no `npm run reminders:check`.

`.env`:

```env
WHATSAPP_GRAPH_VERSION=v20.0
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_TO=
```

Sem essas variáveis, lembretes continuam em modo `[DRY_RUN]`.

O webhook de entrada ainda não foi implementado.

Referência:

- https://developers.facebook.com/docs/whatsapp/cloud-api/overview
