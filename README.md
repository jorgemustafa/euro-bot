# Euroville Booking Bot

Bot local para reservar quadras no app Android Euroville via Appium + ADB.

## Status

- App real controlado com celular Android físico.
- Fluxo validado em `DRY_RUN=true`: encontrou slot disponível sem reservar.
- Próximo foco: ADB Wi‑Fi, confirmação final segura e WhatsApp/LLM.

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

Por segurança, mantenha:

```env
DRY_RUN=true
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

