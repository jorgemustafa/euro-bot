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
  await adb(['shell', 'wm', 'dismiss-keyguard']).catch(() => undefined);
  if (await isLocked()) {
    throw new Error('Android device is still locked. Unlock phone manually or change lockscreen policy.');
  }
  await adb(['shell', 'input', 'keyevent', 'BACK']).catch(() => undefined);
}

async function isLocked() {
  const { stdout } = await adb(['shell', 'dumpsys', 'window']).catch(() => ({ stdout: '' }));
  return /mDreamingLockscreen=true|mShowingLockscreen=true|isStatusBarKeyguard=true|isKeyguardShowing=true/.test(stdout);
}

function deviceArgs() {
  return config.appium.udid ? ['-s', config.appium.udid] : [];
}
