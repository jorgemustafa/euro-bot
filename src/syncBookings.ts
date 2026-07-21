import { wakeDevice } from './adb.js';
import { createDriver } from './appium/createDriver.js';
import { listBookings } from './appium/readBookings.js';
import { mergeBookings, readStoredBookings, saveBookings } from './bookings.js';

async function main() {
  await wakeDevice();
  const driver = await createDriver();

  try {
    const bookings = mergeBookings(await readStoredBookings(), await listBookings(driver));
    await saveBookings(bookings);

    console.log(bookings.length ? bookings : 'Nenhuma reserva registrada.');
  } finally {
    await driver.deleteSession();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
