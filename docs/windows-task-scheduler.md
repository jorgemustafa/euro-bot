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

Via script:

```powershell
npm run daily:install-task
```

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
- Smart Lock/local confiável ativo ou aparelho sem bloqueio forte durante a janela 00:01.
- O projeto não armazena PIN/senha de tela.

Smart Lock já foi validado com `npm run daily:win`.

## Debug

Rode manualmente antes de agendar:

```powershell
npm run daily:win
```
