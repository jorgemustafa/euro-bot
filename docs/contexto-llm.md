# Contexto para LLMs

Sistema: bot local TypeScript para reservar quadras no app Android Euroville.

Stack:

- TypeScript
- Appium 2
- UiAutomator2
- WebdriverIO
- ADB USB/Wi‑Fi
- Vitest

Package Android:

```txt
net.dzigne.sigmaapp.euroville
```

Activity:

```txt
com.example.sigmacon.MainActivity
```

Comportamento esperado:

- Interpretar pedido de reserva.
- Validar quadra, data e horário.
- Consultar disponibilidade no app.
- Reservar somente quando autorizado.
- Informar alternativas próximas se horário indisponível.

Formato interno recomendado:

```json
{
  "intent": "book",
  "court": "QUADRA AREIA 01",
  "date": "2026-07-22",
  "times": ["17:00"]
}
```

Regras:

- Não inventar quadras.
- Não reservar em caso ambíguo.
- Confirmar antes de ação irreversível.
- Preferir horários conforme `.env`.

