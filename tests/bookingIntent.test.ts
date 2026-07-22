import { describe, expect, it } from 'vitest';
import { parseBookingMessage } from '../src/bookingIntent.js';

const courts = ['CAMPO SOCIETY', 'QUADRA AREIA 01', 'QUADRA AREIA 02', 'QUADRA TENIS'];

describe('parseBookingMessage', () => {
  it('parses sand court booking request', () => {
    expect(parseBookingMessage('reservar quadra areia 1 as 17h', courts, new Date(2026, 6, 22))).toEqual({
      intent: 'book',
      court: 'QUADRA AREIA 01',
      date: '2026-07-22',
      times: ['17:00'],
      needsConfirmation: true,
    });
  });

  it('parses tomorrow and tennis aliases', () => {
    expect(parseBookingMessage('agendar tenis amanhã 20:30', courts, new Date(2026, 6, 22))).toMatchObject({
      intent: 'book',
      court: 'QUADRA TENIS',
      date: '2026-07-23',
      times: ['20:30'],
    });
  });

  it('rejects ambiguous requests', () => {
    expect(parseBookingMessage('reservar 17h', courts)).toEqual({
      intent: 'unknown',
      reason: 'Quadra não identificada.',
    });
  });
});
