# ADB Wi-Fi

Objetivo: rodar Appium sem cabo USB.

## Android 11+

No celular:

1. Opções do desenvolvedor.
2. Depuração sem fio.
3. Parear dispositivo com código.

No PC:

```powershell
adb pair IP:PORTA
adb connect IP:PORTA
adb devices -l
```

Depois configure:

```env
ANDROID_UDID=IP:PORTA
```

Valide:

```powershell
npm run adb:devices
npm run book
```

Referência:

- https://developer.android.com/studio/run/device#wireless

