import { readStoredBookings, saveBookings } from './bookings.js';
import { bookingsNeedingReminder, markRemindersSent, reminderMessage } from './reminders.js';

const bookings = await readStoredBookings();
const reminders = bookingsNeedingReminder(bookings);

if (!reminders.length) {
  console.log('Nenhum lembrete pendente.');
  process.exit(0);
}

for (const booking of reminders) {
  console.log(`[DRY_RUN] ${reminderMessage(booking)}`);
}

if (process.env.REMINDERS_MARK_SENT === 'true') {
  await saveBookings(markRemindersSent(bookings, reminders));
  console.log(`${reminders.length} lembrete(s) marcado(s) como enviado(s).`);
}
