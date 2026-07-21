import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { config } from './config.js';

const exec = promisify(execFile);

export async function adb(args: string[]) {
  return exec('adb', [...deviceArgs(), ...args]);
}

export async function wakeDevice() {
  await adb(['shell', 'svc', 'power', 'stayon', 'true']).catch(() => undefined);
  await adb(['shell', 'input', 'keyevent', 'WAKEUP']).catch(() => undefined);
  await unlockDevice();
  if (await isLocked()) {
    throw new Error('Android device is still locked. Unlock phone manually or change lockscreen policy.');
  }
  await adb(['shell', 'input', 'keyevent', 'BACK']).catch(() => undefined);
}

async function unlockDevice() {
  if (!config.appium.unlockPin || !(await isLocked())) return;

  await adb(['shell', 'wm', 'dismiss-keyguard']).catch(() => undefined);
  await adb(['shell', 'input', 'swipe', '540', '1800', '540', '400', '700']).catch(() => undefined);
  await enterPinWithKeyEvents(config.appium.unlockPin);

  if (await isLocked()) {
    await enterPinWithTaps(config.appium.unlockPin);
  }
}

async function isLocked() {
  const { stdout } = await adb(['shell', 'dumpsys', 'window']).catch(() => ({ stdout: '' }));
  return /mDreamingLockscreen=true|mShowingLockscreen=true|isStatusBarKeyguard=true|isKeyguardShowing=true/.test(stdout);
}

async function enterPinWithKeyEvents(pin: string) {
  for (const digit of pin) {
    await adb(['shell', 'input', 'keyevent', String(7 + Number(digit))]);
  }
  await adb(['shell', 'input', 'keyevent', 'ENTER']);
}

async function enterPinWithTaps(pin: string) {
  const coords: Record<string, [string, string]> = {
    '1': ['270', '1180'],
    '2': ['540', '1180'],
    '3': ['810', '1180'],
    '4': ['270', '1380'],
    '5': ['540', '1380'],
    '6': ['810', '1380'],
    '7': ['270', '1580'],
    '8': ['540', '1580'],
    '9': ['810', '1580'],
    '0': ['540', '1780'],
  };

  for (const digit of pin) {
    const [x, y] = coords[digit] ?? [];
    if (x && y) await adb(['shell', 'input', 'tap', x, y]);
  }
  await adb(['shell', 'input', 'keyevent', 'ENTER']);
}

function deviceArgs() {
  return config.appium.udid ? ['-s', config.appium.udid] : [];
}
