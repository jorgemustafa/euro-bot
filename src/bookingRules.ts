export type Slot = {
  court: string;
  time: string;
  available: boolean;
};

export type BookingPreferences = {
  preferredCourts: string[];
  preferredTimes: string[];
  dayOffset?: number;
  dryRun?: boolean;
};

export function chooseSlot(slots: Slot[], preferences: BookingPreferences) {
  const available = slots.filter((slot) => slot.available);

  for (const time of preferences.preferredTimes) {
    for (const court of preferences.preferredCourts) {
      const match = available.find((slot) => slot.time === time && slot.court === court);
      if (match) return match;
    }
  }

  return null;
}
