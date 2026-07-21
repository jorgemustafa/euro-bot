import type { Browser } from 'webdriverio';
import { scrollDown } from './actions.js';
import type { Slot } from '../bookingRules.js';

const slotRegex = /(\d{2}:\d{2})\s+às\s+\d{2}:\d{2}/;

export async function readVisibleSlots(driver: Browser, court: string): Promise<Slot[]> {
  const source = await driver.getPageSource();
  const items = [...source.matchAll(/(?:text|content-desc)="([^"]*)"/g)]
    .map((match) => decodeXml(match[1]))
    .filter(Boolean);

  return items.flatMap((item) => {
    const time = item.match(slotRegex)?.[1];
    if (!time) return [];

    return {
      court,
      time,
      available: item.includes('DISPONÍVEL'),
    };
  });
}

export async function findSlot(driver: Browser, court: string, times: string[]) {
  const seen = new Map<string, Slot>();

  for (let i = 0; i < 8; i += 1) {
    for (const slot of await readVisibleSlots(driver, court)) {
      seen.set(slot.time, slot);
    }

    const match = times.map((time) => seen.get(time)).find((slot) => slot?.available);
    if (match) return match;

    if (times.every((time) => seen.has(time))) return null;

    await scrollDown(driver);
  }

  return null;
}

export async function tapReserveForVisibleTime(driver: Browser, time: string) {
  const slots = await readVisibleSlots(driver, '');
  const index = slots.findIndex((slot) => slot.time === time);
  if (index === -1) throw new Error(`Horário não visível: ${time}`);

  const buttons = await driver.$$(`//android.widget.Button[@content-desc="RESERVAR"]`);
  const button = buttons[index];
  if (!button) throw new Error(`Botão RESERVAR não encontrado para ${time}`);

  if (!(await button.isEnabled())) {
    throw new Error(`Botão RESERVAR desabilitado para ${time}`);
  }

  await button.click();
}

function decodeXml(value: string) {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}
