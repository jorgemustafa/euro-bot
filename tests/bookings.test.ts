import { describe, expect, it } from 'vitest';
import { mergeBookings, parseBookingsFromSource } from '../src/bookings.js';

describe('parseBookingsFromSource', () => {
  it('parses registered bookings from accessibility text', () => {
    const source = '<node content-desc="APROVADA&#xA;CAMPO SOCIETY&#xA;Dia 22/07/2026 - 17:00 às 18:00" />';

    expect(parseBookingsFromSource(source, ['CAMPO SOCIETY'])).toEqual([
      {
        court: 'CAMPO SOCIETY',
        date: '22/07/2026',
        startTime: '17:00',
        endTime: '18:00',
        status: 'APROVADA',
        reminderSentAt: null,
      },
    ]);
  });
});

describe('mergeBookings', () => {
  it('keeps reminder state when syncing same booking', () => {
    const booking = {
      court: 'CAMPO SOCIETY',
      date: '22/07/2026',
      startTime: '17:00',
      endTime: '18:00',
      status: 'RESERVADO',
      reminderSentAt: null,
    };

    expect(mergeBookings([{ ...booking, reminderSentAt: 'sent' }], [booking])[0].reminderSentAt).toBe('sent');
  });
});
