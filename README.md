# Euroville Booking Bot

Bot local para reservar quadras no app Android Euroville via Appium + ADB.

## Status

- App real controlado com celular Android físico.
- Fluxo validado em `DRY_RUN=true`: encontrou slot disponível sem reservar.
- ADB Wi‑Fi validado sem cabo USB.
- Reserva real validada.
- Leitura de reservas registradas validada.
- Lembretes locais 1h antes preparados.
- Próximo foco: automação 00:01 e WhatsApp/LLM.

## Como roda

```txt
Windows Task Scheduler
  -> npm run book
    -> Appium
      -> ADB USB ou Wi-Fi
        -> celular Android
          -> app Euroville
```

## Setup

```bash
npm install
npx appium driver install uiautomator2@4
cp .env.example .env
```

Valide:

```bash
npm run doctor:android
npm run adb:devices
npm test
npm run typecheck
```

## Rodar

Terminal 1:

```bash
npm run appium
```

Terminal 2:

```bash
npm run book
```

Reservas registradas:

```bash
npm run bookings:sync
```

Lembretes locais:

```bash
npm run reminders:check
```

Por segurança, mantenha:

```env
DRY_RUN=true
REMINDERS_MARK_SENT=false
```

## ADB Wi-Fi

Depois de parear/conectar o celular via Wi‑Fi, preencha:

```env
ANDROID_UDID=192.168.0.50:5555
```

## Referências

- [Appium UiAutomator2](https://appium.io/docs/en/3.3/quickstart/uiauto2-driver/)
- [ADB](https://developer.android.com/tools/adb)
- [Android wireless debugging](https://developer.android.com/studio/run/device#wireless)
- [WebdriverIO](https://webdriver.io/docs/api)
