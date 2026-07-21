import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { config } from './config.js';

const exec = promisify(execFile);

export async function adb(args: string[]) {
  return exec('adb', [...deviceArgs(), ...args]);
}

export async function wakeDevice() {
  await adb(['shell', 'input', 'keyevent', 'WAKEUP']).catch(() => undefined);
  await adb(['shell', 'input', 'keyevent', 'MENU']).catch(() => undefined);
  await adb(['shell', 'input', 'keyevent', 'BACK']).catch(() => undefined);
  await adb(['shell', 'svc', 'power', 'stayon', 'true']).catch(() => undefined);
}

function deviceArgs() {
  return config.appium.udid ? ['-s', config.appium.udid] : [];
}
