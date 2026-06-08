import { format, parse, isMonday, isTuesday, isWednesday, isThursday } from 'date-fns';

export const SLOT_TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'] as const;

export type BookingSlot = {
  id: string;
  date: string;
  time: string;
  timezone: string;
  status?: 'Available' | 'Booked' | 'Hidden';
  hasOverride?: boolean;
  generated?: boolean;
};

export const toDateString = (date: Date) => format(date, 'yyyy-MM-dd');

export const parseDateString = (dateStr: string) => parse(dateStr, 'yyyy-MM-dd', new Date());

export const isMonThu = (date: Date) =>
  isMonday(date) || isTuesday(date) || isWednesday(date) || isThursday(date);

export const groupSlotsByDate = (slots: BookingSlot[]) => {
  const map = new Map<string, BookingSlot[]>();
  for (const slot of slots) {
    const existing = map.get(slot.date) || [];
    existing.push(slot);
    map.set(slot.date, existing);
  }
  for (const [, daySlots] of map) {
    daySlots.sort((a, b) => a.time.localeCompare(b.time));
  }
  return map;
};

export const getSelectableDates = (slots: BookingSlot[], mode: 'client' | 'admin') => {
  const dates = new Set<string>();
  for (const slot of slots) {
    if (mode === 'client' && slot.status && slot.status !== 'Available') continue;
    dates.add(slot.date);
  }
  return Array.from(dates)
    .filter((dateStr) => isMonThu(parseDateString(dateStr)))
    .sort();
};

export const getSlotsForDate = (slots: BookingSlot[], date: string, mode: 'client' | 'admin') => {
  const daySlots = slots.filter((slot) => slot.date === date);
  if (mode === 'client') {
    return daySlots.filter((slot) => !slot.status || slot.status === 'Available');
  }
  const byTime = new Map(daySlots.map((slot) => [slot.time, slot]));
  const timezone = daySlots[0]?.timezone || 'Europe/London';
  return SLOT_TIMES.map((time) => {
    const existing = byTime.get(time);
    if (existing) return existing;
    return {
      id: `${date}_${time}`,
      date,
      time,
      timezone,
      status: 'Available' as const,
      generated: true,
      hasOverride: false,
    };
  });
};
