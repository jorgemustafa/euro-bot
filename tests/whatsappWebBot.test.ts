import { describe, expect, it } from 'vitest';
import { handleWhatsAppText, isAllowedSender, type PendingBooking } from '../src/whatsappWebBot.js';

const courts = ['CAMPO SOCIETY', 'QUADRA AREIA 01', 'QUADRA AREIA 02'];

describe('isAllowedSender', () => {
  it('allows all senders when whitelist is empty', () => {
    expect(isAllowedSender('5511999999999@c.us', [])).toBe(true);
  });

  it('allows only configured senders', () => {
    expect(isAllowedSender('5511999999999@c.us', ['5511999999999'])).toBe(true);
    expect(isAllowedSender('5511888888888@c.us', ['5511999999999'])).toBe(false);
  });
});

describe('handleWhatsAppText', () => {
  it('creates pending booking and asks confirmation', () => {
    const reply = handleWhatsAppText('reservar quadra areia 1 as 17h', undefined, courts);

    expect(reply.pending).toMatchObject({ court: 'QUADRA AREIA 01', times: ['17:00'] });
    expect(reply.text).toContain('Responda SIM');
  });

  it('confirms pending booking', () => {
    const pending: PendingBooking = {
      intent: 'book',
      court: 'CAMPO SOCIETY',
      date: '2026-07-24',
      times: ['17:00'],
      needsConfirmation: true,
    };

    expect(handleWhatsAppText('sim', pending, courts)).toEqual({
      text: 'Confirmado. Vou tentar reservar: CAMPO SOCIETY em 2026-07-24 às 17:00.',
      pending: null,
    });
  });

  it('cancels pending booking', () => {
    const pending: PendingBooking = {
      intent: 'book',
      court: 'CAMPO SOCIETY',
      date: '2026-07-24',
      times: ['17:00'],
      needsConfirmation: true,
    };

    expect(handleWhatsAppText('não', pending, courts)).toEqual({
      text: 'Reserva pendente cancelada.',
      pending: null,
    });
  });
});
