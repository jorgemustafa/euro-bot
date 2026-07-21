import { config } from './config.js';
import { createDriver } from './appium/createDriver.js';
import {
  isTextVisible,
  saveScreenshot,
  tapByDescription,
  tapByText,
  tapByTextOrDescription,
  tapLastButton,
} from './appium/actions.js';
import { findSlot, tapReserveForVisibleTime, waitUntilSlotBooked } from './appium/readSlots.js';

async function main() {
  const driver = await createDriver();

  try {
    await driver.terminateApp(config.appium.appPackage).catch(() => undefined);
    await driver.activateApp(config.appium.appPackage);

    if (!(await isTextVisible(driver, 'Reservas'))) {
      await tapByDescription(driver, 'Reservas');
    }

    await tapLastButton(driver);

    for (const court of config.booking.preferredCourts) {
      await tapByTextOrDescription(driver, court);
      await tapByTextOrDescription(driver, 'Verificar disponibilidade');
      await tapByTextOrDescription(driver, targetDay(config.booking.dayOffset));

      const slot = await findSlot(driver, court, config.booking.preferredTimes);
      if (!slot) {
        await driver.back();
        continue;
      }

      if (config.booking.dryRun) {
        console.log(`[DRY_RUN] Slot disponível: ${slot.court} ${slot.time}`);
        return;
      }

      await tapReserveForVisibleTime(driver, slot.time);
      const bookedSlot = await waitUntilSlotBooked(driver, slot.court, slot.time);
      console.log(`Reserva confirmada na tela: ${bookedSlot.court} ${bookedSlot.time} (${bookedSlot.status})`);
      return;
    }

    console.log('Nenhum horário preferido disponível.');
  } catch (error) {
    await saveScreenshot(driver, 'error');
    throw error;
  } finally {
    await driver.deleteSession();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

function targetDay(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return String(date.getDate());
}
