export type BookingIntent =
  | { intent: 'book'; court: string; date: string; times: string[]; needsConfirmation: true }
  | { intent: 'unknown'; reason: string };

export function parseBookingMessage(message: string, courts: string[], now = new Date()): BookingIntent {
  const text = normalize(message);
  if (!/\b(reserv|agend)/.test(text)) return { intent: 'unknown', reason: 'Mensagem não parece pedido de reserva.' };

  const court = findCourt(text, courts);
  if (!court) return { intent: 'unknown', reason: 'Quadra não identificada.' };

  const time = findTime(text);
  if (!time) return { intent: 'unknown', reason: 'Horário não identificado.' };

  return {
    intent: 'book',
    court,
    date: findDate(text, now),
    times: [time],
    needsConfirmation: true,
  };
}

function findCourt(text: string, courts: string[]) {
  return courts.find((court) => normalize(court).split(/\s+/).every((part) => text.includes(part))) ?? findCourtAlias(text, courts);
}

function findCourtAlias(text: string, courts: string[]) {
  const areia = text.match(/\bareia\s*0?(\d)\b/);
  if (areia) return courts.find((court) => normalize(court).includes(`areia 0${areia[1]}`));

  if (text.includes('tenis')) return courts.find((court) => normalize(court).includes('tenis'));
  if (text.includes('society')) return courts.find((court) => normalize(court).includes('society'));
}

function findTime(text: string) {
  const match = text.match(/\b(\d{1,2})(?::(\d{2})|h)\b/);
  if (!match) return;

  const hour = Number(match[1]);
  if (hour < 0 || hour > 23) return;

  return `${String(hour).padStart(2, '0')}:${match[2] ?? '00'}`;
}

function findDate(text: string, now: Date) {
  const date = new Date(now);
  if (text.includes('amanha')) date.setDate(date.getDate() + 1);

  const explicit = text.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
  if (explicit) {
    date.setFullYear(explicit[3] ? Number(explicit[3].padStart(4, '20')) : now.getFullYear());
    date.setMonth(Number(explicit[2]) - 1);
    date.setDate(Number(explicit[1]));
  }

  return date.toISOString().slice(0, 10);
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}
