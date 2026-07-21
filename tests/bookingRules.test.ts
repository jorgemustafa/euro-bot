import { describe, expect, it } from 'vitest';
import { chooseSlot, type Slot } from '../src/bookingRules.js';

const slots: Slot[] = [
  { court: 'Quadra 1', time: '19:00', available: false },
  { court: 'Quadra 2', time: '19:00', available: true },
  { court: 'Quadra 1', time: '20:00', available: true },
];

describe('chooseSlot', () => {
  it('prioriza horário antes de quadra', () => {
    expect(
      chooseSlot(slots, {
        preferredCourts: ['Quadra 1', 'Quadra 2'],
        preferredTimes: ['19:00', '20:00'],
      }),
    ).toEqual({ court: 'Quadra 2', time: '19:00', available: true });
  });

  it('ignora horários indisponíveis', () => {
    expect(
      chooseSlot(slots, {
        preferredCourts: ['Quadra 1'],
        preferredTimes: ['19:00', '20:00'],
      }),
    ).toEqual({ court: 'Quadra 1', time: '20:00', available: true });
  });

  it('retorna null quando não existe slot preferido disponível', () => {
    expect(
      chooseSlot(slots, {
        preferredCourts: ['Quadra 3'],
        preferredTimes: ['18:00'],
      }),
    ).toBeNull();
  });
});
