import type { Booking } from './bookings.js';

export function bookingsNeedingReminder(bookings: Booking[], now = new Date()) {
  return bookings.filter((booking) => {
    if (booking.reminderSentAt) return false;

    const start = bookingStart(booking);
    const msUntilStart = start.getTime() - now.getTime();

    return msUntilStart > 0 && msUntilStart <= 60 * 60 * 1_000;
  });
}

export function reminderMessage(booking: Booking) {
  return `Lembrete: sua reserva ${booking.court} começa em 1h, ${booking.date} às ${booking.startTime}.`;
}

function bookingStart(booking: Booking) {
  const [day, month, year] = booking.date.split('/').map(Number);
  const [hour, minute] = booking.startTime.split(':').map(Number);

  return new Date(year, month - 1, day, hour, minute);
}
