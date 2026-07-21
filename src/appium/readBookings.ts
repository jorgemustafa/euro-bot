import type { Browser } from 'webdriverio';
import { config } from '../config.js';
import { parseBookingsFromSource } from '../bookings.js';
import { tapByDescription, waitForTextOrDescription } from './actions.js';

export async function listBookings(driver: Browser) {
  await driver.terminateApp(config.appium.appPackage).catch(() => undefined);
  await driver.activateApp(config.appium.appPackage);
  await waitForTextOrDescription(driver, 'Reservas');

  if (!(await isBookingsPage(driver))) {
    await tapByDescription(driver, 'Reservas');
    await waitForTextOrDescription(driver, 'Áreas');
  }

  await driver.pause(1_000);
  return parseBookingsFromSource(await driver.getPageSource(), config.booking.preferredCourts);
}

async function isBookingsPage(driver: Browser) {
  const source = await driver.getPageSource();
  return source.includes('Áreas') && source.includes('Atividades');
}
