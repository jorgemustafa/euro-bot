# WhatsApp Web MVP

MVP pessoal sem conta Business e sem número separado.

Usa `whatsapp-web.js`, que controla uma sessão WhatsApp Web local.

## Tradeoff

- Não usa Cloud API oficial.
- Não precisa número novo.
- Não precisa conta Business.
- Não cobra Meta.
- Usa sua conta atual do WhatsApp.
- Pode quebrar se WhatsApp Web mudar.
- Existe risco de bloqueio/ban por automação não oficial.

Para reduzir risco:

- usar baixo volume;
- whitelist de remetentes;
- não mandar spam;
- futuramente migrar para chip/número dedicado.

## Rodar

```powershell
npm run whatsapp:dev
```

Primeira execução:

1. terminal mostra QR code;
2. abra WhatsApp no celular;
3. escaneie como WhatsApp Web;
4. sessão fica salva em `.wwebjs_auth`.

## Config

`.env`:

```env
WHATSAPP_ALLOWED_SENDERS=55seunumero,55numeroesposa
WHATSAPP_NOTIFY_TO=55seunumero,55numeroesposa
WHATSAPP_SESSION_PATH=.wwebjs_auth
WHATSAPP_CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
```

`WHATSAPP_ALLOWED_SENDERS` é obrigatório. Se ficar vazio, o bot não inicia.

Use somente números confiáveis. Exemplo:

```env
WHATSAPP_ALLOWED_SENDERS=5511999999999,5511888888888
```

O bot ignora grupos, status, mensagens próprias e mensagens antigas recebidas antes de iniciar.

## Fluxo atual

Mensagem:

```txt
reservar quadra areia 1 as 17h
```

Resposta:

```txt
Entendi: QUADRA AREIA 01 em 2026-07-23 às 17:00.
Responda SIM para confirmar ou NÃO para cancelar.
```

Confirmação:

```txt
SIM
```

Resposta atual:

```txt
Confirmado. Vou tentar reservar: QUADRA AREIA 01 em 2026-07-23 às 17:00.
```

Nesta primeira versão, o WhatsApp ainda não chama `book` real. Primeiro validamos login, recebimento, whitelist e fluxo de confirmação.

## Próximo passo

Depois do QR/login funcionar:

1. conectar `SIM` ao engine de reserva;
2. responder sucesso/falha real;
3. listar horários próximos;
4. enviar lembretes para `WHATSAPP_NOTIFY_TO`.

## Troubleshooting

Se aparecer erro dizendo que o browser já está rodando para `.wwebjs_auth`, encerre os processos Chrome criados pelo bot ou apague a sessão local:

```powershell
Remove-Item -Recurse -Force .wwebjs_auth*
```

Isso força novo QR code na próxima execução.
