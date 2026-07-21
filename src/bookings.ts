import { mkdir, readFile, writeFile } from 'node:fs/promises';

export type Booking = {
  court: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  reminderSentAt: string | null;
};

const dbPath = 'data/bookings.json';
const dateRegex = /(\d{2}\/\d{2}\/\d{4})/;
const timeRegex = /(\d{2}:\d{2})\s+às\s+(\d{2}:\d{2})/;
const statuses = ['APROVADA', 'CANCELADA', 'RESERVADO', 'CONFIRMADO', 'PENDENTE'];

export function parseBookingsFromSource(source: string, courts: string[]) {
  const items = [...source.matchAll(/(?:text|content-desc)="([^"]*)"/g)].map((match) => decodeXml(match[1]));

  return items.flatMap((item): Booking[] => {
    const court = courts.find((name) => item.includes(name));
    const date = item.match(dateRegex)?.[1];
    const time = item.match(timeRegex);
    const status = statuses.find((value) => item.includes(value));

    if (!court || !date || !time || !status) return [];

    return [
      {
        court,
        date,
        startTime: time[1],
        endTime: time[2],
        status,
        reminderSentAt: null,
      },
    ];
  });
}

export async function readStoredBookings() {
  try {
    return JSON.parse(await readFile(dbPath, 'utf8')) as Booking[];
  } catch {
    return [];
  }
}

export async function saveBookings(bookings: Booking[]) {
  await mkdir('data', { recursive: true });
  await writeFile(dbPath, `${JSON.stringify(bookings, null, 2)}\n`);
}

export function mergeBookings(stored: Booking[], fresh: Booking[]) {
  const byId = new Map(stored.map((booking) => [bookingId(booking), booking]));

  for (const booking of fresh) {
    byId.set(bookingId(booking), {
      ...booking,
      reminderSentAt: byId.get(bookingId(booking))?.reminderSentAt ?? null,
    });
  }

  return [...byId.values()].sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
}

function bookingId(booking: Booking) {
  return `${booking.court}|${booking.date}|${booking.startTime}`;
}

function decodeXml(value: string) {
  return value
    .replaceAll('&#10;', '\n')
    .replaceAll('&#xA;', '\n')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}
