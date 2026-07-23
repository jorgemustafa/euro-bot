import type { BookingIntent } from './bookingIntent.js';
import { parseBookingMessage } from './bookingIntent.js';

export type PendingBooking = Extract<BookingIntent, { intent: 'book' }>;
export type BotReply = { text: string; pending?: PendingBooking | null };

export function isAllowedSender(sender: string, allowedSenders: string[]) {
  return allowedSenders.length > 0 && allowedSenders.some((allowed) => sender.includes(onlyDigits(allowed)));
}

export function handleWhatsAppText(message: string, pending: PendingBooking | undefined, courts: string[]): BotReply {
  if (isYes(message)) {
    if (!pending) return { text: 'Não há reserva pendente para confirmar.' };
    return { text: bookingSummary(pending, 'Confirmado. Vou tentar reservar:'), pending: null };
  }

  if (isNo(message)) {
    if (!pending) return { text: 'Não há reserva pendente para cancelar.' };
    return { text: 'Reserva pendente cancelada.', pending: null };
  }

  const intent = parseBookingMessage(message, courts);
  if (intent.intent === 'unknown') return { text: intent.reason };

  return {
    text: `${bookingSummary(intent, 'Entendi:')}\nResponda SIM para confirmar ou NÃO para cancelar.`,
    pending: intent,
  };
}

function bookingSummary(booking: PendingBooking, prefix: string) {
  return `${prefix} ${booking.court} em ${booking.date} às ${booking.times.join(', ')}.`;
}

function isYes(message: string) {
  return /^(sim|s|ok|confirmo|confirmar)$/i.test(message.trim());
}

function isNo(message: string) {
  return /^(nao|não|n|cancelar)$/i.test(message.trim());
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}
