# Plano de ação

## Objetivo

Reservar quadras no app Euroville com:

- rotina automática diária às 00:01;
- comando sob demanda via WhatsApp;
- celular sem cabo USB usando ADB Wi‑Fi.

## Fases

### 1. Estabilizar reserva real - DONE

- Ler tela "Reservas" uma tela atrás, onde ficam reservas registradas.
- Confirmar reserva só após flag explícita.
- Registrar sucesso/falha com screenshot e log.
- Manter `DRY_RUN=true` como padrão.

### 2. Remover cabo USB - DONE

- Ativar depuração sem fio no Android.
- Parear PC e celular.
- Configurar `ANDROID_UDID=ip:porta`.
- Validar `npm run book` sem USB.

### 3. Automatizar 00:01 - DONE

- Criar script PowerShell robusto.
- Subir Appium se necessário.
- Validar device conectado.
- Agendar no Windows Task Scheduler.

### 4. Lidar com tela bloqueada - DONE

- Detectar se device está disponível antes da reserva.
- Acordar tela via ADB quando possível.
- Evitar depender do celular estar desbloqueado manualmente.
- Avaliar opções:
  - Android sem bloqueio forte durante janela de agendamento;
  - Smart Lock/local confiável;
  - emulador Android dedicado;
  - fallback: notificar falha via WhatsApp quando device estiver bloqueado/offline.
- Não armazenar PIN/senha de tela no projeto.

### 5. WhatsApp + LLM

- Usar WhatsApp Business Cloud API.
- Receber mensagens por webhook HTTPS.
- Converter texto livre em JSON validado.
- Confirmar antes de reservar quando houver ambiguidade.
- Responder confirmação, falha e horários próximos.
- Enviar lembrete 1h antes para reservas registradas.

### 6. Lembretes

- Ler reservas existentes na tela `Reservas`.
- Persistir reservas em arquivo local simples.
- Agendar lembrete 1h antes.
- Enviar WhatsApp: quadra, data, horário.
- Evitar lembrete duplicado com `reminderSentAt`.

## Regra de arquitetura

WhatsApp, cron e CLI devem chamar mesma engine:

```ts
book({ court, date, times, dryRun })
listBookings()
sendReminder(booking)
```

LLM nunca clica no app. LLM só interpreta intenção.
