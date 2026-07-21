import { describe, expect, it } from 'vitest';
import { bookingsNeedingReminder, reminderMessage } from '../src/reminders.js';

const booking = {
  court: 'CAMPO SOCIETY',
  date: '22/07/2026',
  startTime: '17:00',
  endTime: '18:00',
  status: 'APROVADA',
  reminderSentAt: null,
};

describe('bookingsNeedingReminder', () => {
  it('returns bookings starting within the next hour', () => {
    expect(bookingsNeedingReminder([booking], new Date(2026, 6, 22, 16, 15))).toEqual([booking]);
  });

  it('skips bookings already reminded', () => {
    expect(bookingsNeedingReminder([{ ...booking, reminderSentAt: 'sent' }], new Date(2026, 6, 22, 16, 15))).toEqual(
      [],
    );
  });
});

describe('reminderMessage', () => {
  it('builds WhatsApp reminder text', () => {
    expect(reminderMessage(booking)).toBe('Lembrete: sua reserva CAMPO SOCIETY começa em 1h, 22/07/2026 às 17:00.');
  });
});
