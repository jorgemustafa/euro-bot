# Comandos úteis

Comandos para operar e debugar o Euroville Bot no Windows.

## Rotina principal

```powershell
npm run daily:win
```

Executa fluxo completo:

1. conecta ADB Wi‑Fi;
2. valida device;
3. roda reserva;
4. sincroniza reservas;
5. verifica lembretes;
6. grava log em `logs/daily-*.log`.

## Reserva

Dry-run, sem reservar:

```powershell
$env:DRY_RUN="true"; npm run book
```

Reserva real:

```powershell
$env:DRY_RUN="false"; npm run book
```

## Reservas registradas

```powershell
npm run bookings:sync
```

Lê tela `Reservas` do app e atualiza `data/bookings.json`.

## Lembretes

```powershell
npm run reminders:check
```

Sem WhatsApp configurado, roda em modo `[DRY_RUN]`.

## WhatsApp Web

Rodar bot local:

```powershell
npm run whatsapp:dev
```

Primeira execução mostra QR code para parear WhatsApp Web.
Antes de rodar, configure `WHATSAPP_ALLOWED_SENDERS` no `.env`.

Parar Chrome travado do bot:

```powershell
npm run whatsapp:stop
```

Use se travar em `WhatsApp carregando: 99%`.

## Appium

Subir servidor manualmente:

```powershell
npm run appium
```

Validar driver Android:

```powershell
npm run doctor:android
```

Instalar driver UiAutomator2:

```powershell
npx appium driver install uiautomator2
```

## ADB

Listar devices:

```powershell
npm run adb:devices
```

Reconectar ADB Wi‑Fi:

```powershell
adb connect 192.168.0.80:5555
```

Troque IP/porta pelo valor de `ANDROID_UDID`.

Dump da tela atual:

```powershell
npm run ui:dump
```

## Windows Task Scheduler

Criar/atualizar tarefa diária 00:01:

```powershell
npm run daily:install-task
```

Ativar rotina automática:

```powershell
Enable-ScheduledTask -TaskName "Euroville Booking Bot"
```

Desativar rotina automática:

```powershell
Disable-ScheduledTask -TaskName "Euroville Booking Bot"
```

Ver status:

```powershell
Get-ScheduledTask -TaskName "Euroville Booking Bot" | Select-Object TaskName,State
```

Ver última/próxima execução:

```powershell
Get-ScheduledTaskInfo -TaskName "Euroville Booking Bot"
```

Rodar tarefa agora pelo Agendador:

```powershell
Start-ScheduledTask -TaskName "Euroville Booking Bot"
```

Resultado esperado:

- `LastTaskResult = 0`: sucesso;
- `LastTaskResult = 1`: falha no script/comando.

## Validação local

Testes:

```powershell
npm test
```

Typecheck:

```powershell
npm run typecheck
```

## GitHub

Ver PRs abertos:

```powershell
gh pr list
```

Abrir PR da branch atual:

```powershell
gh pr create --base main
```
