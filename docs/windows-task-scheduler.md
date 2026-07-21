# Windows Task Scheduler

Script diário:

```powershell
npm run daily:win
```

Ele faz:

1. lê `.env`;
2. sobe Appium se não estiver rodando;
3. reconecta ADB Wi‑Fi quando `ANDROID_UDID=ip:porta`;
4. valida device conectado;
5. roda `npm run book`;
6. roda `npm run bookings:sync`;
7. roda `npm run reminders:check`.

## Criar tarefa 00:01

No Agendador de Tarefas:

- Trigger: diariamente `00:01`;
- Action:
  - Program: `powershell`
  - Arguments: `-ExecutionPolicy Bypass -File scripts/run-daily.ps1`
  - Start in: caminho do repo, exemplo:

```txt
C:\Users\Jorge Fernando\Projects\euro-bot
```

## Pré-requisitos

- App autenticado no celular.
- ADB Wi‑Fi ativo e `ANDROID_UDID` correto.
- Celular ligado, na mesma rede, acessível via ADB.
- Se a tela bloqueada impedir o fluxo, configure `ANDROID_UNLOCK_PIN` apenas no `.env` local.
- Unlock via ADB é best-effort. Alguns Android/Samsung bloqueiam input remoto na lockscreen segura.
- Se continuar bloqueado, use Smart Lock/local confiável ou deixe o aparelho sem bloqueio forte durante a janela 00:01.
- Nunca commitar senha/PIN real.

## Debug

Rode manualmente antes de agendar:

```powershell
npm run daily:win
```
