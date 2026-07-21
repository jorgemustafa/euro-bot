# Plano de ação

## Objetivo

Reservar quadras no app Euroville com:

- rotina automática diária às 00:01;
- comando sob demanda via WhatsApp;
- celular sem cabo USB usando ADB Wi‑Fi.

## Fases

### 1. Estabilizar reserva real

- Mapear tela pós-`RESERVAR`.
- Confirmar reserva só após flag explícita.
- Registrar sucesso/falha com screenshot e log.
- Manter `DRY_RUN=true` como padrão.

### 2. Remover cabo USB

- Ativar depuração sem fio no Android.
- Parear PC e celular.
- Configurar `ANDROID_UDID=ip:porta`.
- Validar `npm run book` sem USB.

### 3. Automatizar 00:01

- Criar script PowerShell robusto.
- Subir Appium se necessário.
- Validar device conectado.
- Agendar no Windows Task Scheduler.

### 4. WhatsApp + LLM

- Usar WhatsApp Business Cloud API.
- Receber mensagens por webhook HTTPS.
- Converter texto livre em JSON validado.
- Confirmar antes de reservar quando houver ambiguidade.
- Responder confirmação, falha e horários próximos.

## Regra de arquitetura

WhatsApp, cron e CLI devem chamar mesma engine:

```ts
book({ court, date, times, dryRun })
```

LLM nunca clica no app. LLM só interpreta intenção.

