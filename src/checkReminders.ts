import { readStoredBookings, saveBookings, type Booking } from './bookings.js';
import { bookingsNeedingReminder, markRemindersSent, reminderMessage } from './reminders.js';
import { isWhatsAppConfigured, sendWhatsAppText } from './whatsapp.js';

const bookings = await readStoredBookings();
const reminders = bookingsNeedingReminder(bookings);
const sent: Booking[] = [];
const whatsappEnabled = isWhatsAppConfigured();

if (!reminders.length) {
  console.log('Nenhum lembrete pendente.');
  process.exit(0);
}

for (const booking of reminders) {
  const message = reminderMessage(booking);

  if (!whatsappEnabled) {
    console.log(`[DRY_RUN] ${message}`);
    continue;
  }

  await sendWhatsAppText(message);
  sent.push(booking);
  console.log(`Lembrete enviado: ${booking.court} ${booking.date} ${booking.startTime}`);
}

const delivered = whatsappEnabled ? sent : process.env.REMINDERS_MARK_SENT === 'true' ? reminders : [];
if (delivered.length) {
  await saveBookings(markRemindersSent(bookings, delivered));
  console.log(`${delivered.length} lembrete(s) marcado(s) como enviado(s).`);
}
