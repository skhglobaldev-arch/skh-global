import { getFirebaseAdmin, COLLECTIONS } from './firebase-admin';
import type { SlotStatus } from './types';

export const BOOKING_TIMEZONE = process.env.BOOKING_TIMEZONE || 'Europe/London';
export const BOOKING_WEEKS_AHEAD = Number(process.env.BOOKING_WEEKS_AHEAD || 6);
export const SLOT_HOURS = [9, 10, 11, 12, 13, 14] as const;
const WEEKDAYS_MON_THU = new Set(['Mon', 'Tue', 'Wed', 'Thu']);

export type GeneratedSlot = {
  id: string;
  date: string;
  time: string;
  timezone: string;
  durationMinutes: number;
};

export const makeSlotId = (date: string, time: string) => `${date}_${time}`;

export const parseSlotId = (slotId: string): { date: string; time: string } | null => {
  const match = /^(\d{4}-\d{2}-\d{2})_(\d{2}:\d{2})$/.exec(slotId);
  if (!match) return null;
  return { date: match[1], time: match[2] };
};

export const formatHour = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

export const getTodayInTimezone = (timezone = BOOKING_TIMEZONE) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date());

export const addDaysToDate = (dateStr: string, days: number) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
};

export const getWeekdayShort = (dateStr: string, timezone = BOOKING_TIMEZONE) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const noonUtc = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'short' }).format(noonUtc);
};

export const isWeekdayMonThu = (dateStr: string, timezone = BOOKING_TIMEZONE) =>
  WEEKDAYS_MON_THU.has(getWeekdayShort(dateStr, timezone));

export const getNowInTimezone = (timezone = BOOKING_TIMEZONE) => {
  const date = getTodayInTimezone(timezone);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);
  return { date, minutes: hour * 60 + minute };
};

export const isSlotInPast = (date: string, time: string, timezone = BOOKING_TIMEZONE) => {
  const now = getNowInTimezone(timezone);
  if (date < now.date) return true;
  if (date > now.date) return false;
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute <= now.minutes;
};

export const isValidGeneratedSlot = (date: string, time: string, timezone = BOOKING_TIMEZONE) => {
  if (!isWeekdayMonThu(date, timezone)) return false;
  const hour = Number(time.slice(0, 2));
  return SLOT_HOURS.includes(hour as (typeof SLOT_HOURS)[number]) && time.endsWith(':00');
};

export const generateRecurringSlots = (options?: {
  weeksAhead?: number;
  timezone?: string;
}): GeneratedSlot[] => {
  const timezone = options?.timezone || BOOKING_TIMEZONE;
  const weeksAhead = options?.weeksAhead ?? BOOKING_WEEKS_AHEAD;
  const slots: GeneratedSlot[] = [];
  const today = getTodayInTimezone(timezone);
  const totalDays = weeksAhead * 7;

  for (let offset = 0; offset <= totalDays; offset += 1) {
    const date = addDaysToDate(today, offset);
    if (!isWeekdayMonThu(date, timezone)) continue;

    for (const hour of SLOT_HOURS) {
      const time = formatHour(hour);
      if (isSlotInPast(date, time, timezone)) continue;
      slots.push({
        id: makeSlotId(date, time),
        date,
        time,
        timezone,
        durationMinutes: 60,
      });
    }
  }

  return slots;
};

type SlotOverride = {
  status?: SlotStatus;
  date?: string;
  time?: string;
  timezone?: string;
  durationMinutes?: number;
};

export const loadSlotOverridesInRange = async (startDate: string, endDate: string) => {
  const { db } = getFirebaseAdmin();
  const snapshot = await db
    .collection(COLLECTIONS.availabilitySlots)
    .where('date', '>=', startDate)
    .where('date', '<=', endDate)
    .get();

  const overrides = new Map<string, SlotOverride & { id: string }>();
  for (const doc of snapshot.docs) {
    overrides.set(doc.id, { id: doc.id, ...(doc.data() as SlotOverride) });
  }
  return overrides;
};

export const loadBookedSlotKeysInRange = async (startDate: string, endDate: string) => {
  const { db } = getFirebaseAdmin();
  const snapshot = await db
    .collection(COLLECTIONS.callBookings)
    .where('date', '>=', startDate)
    .where('date', '<=', endDate)
    .get();

  const booked = new Set<string>();
  for (const doc of snapshot.docs) {
    const data = doc.data() as { date?: string; time?: string; slotId?: string };
    if (data.date && data.time) {
      booked.add(makeSlotId(data.date, data.time));
    } else if (data.slotId) {
      booked.add(data.slotId);
    }
  }
  return booked;
};

export const getAvailableSlots = async () => {
  const generated = generateRecurringSlots();
  if (!generated.length) return [];

  const startDate = generated[0].date;
  const endDate = generated[generated.length - 1].date;
  const [overrides, bookedKeys] = await Promise.all([
    loadSlotOverridesInRange(startDate, endDate),
    loadBookedSlotKeysInRange(startDate, endDate),
  ]);

  return generated
    .filter((slot) => {
      const override = overrides.get(slot.id);
      if (override?.status === 'Hidden' || override?.status === 'Booked') return false;
      if (bookedKeys.has(slot.id)) return false;
      return true;
    })
    .map((slot) => ({
      ...slot,
      status: 'Available' as const,
    }));
};

export const getAdminMergedSlots = async () => {
  const generated = generateRecurringSlots();
  const startDate = generated[0]?.date || getTodayInTimezone();
  const endDate = generated[generated.length - 1]?.date || startDate;
  const [overrides, bookedKeys] = await Promise.all([
    loadSlotOverridesInRange(startDate, endDate),
    loadBookedSlotKeysInRange(startDate, endDate),
  ]);

  const merged = new Map<string, Record<string, unknown>>();

  for (const slot of generated) {
    const override = overrides.get(slot.id);
    let status: SlotStatus = 'Available';
    if (override?.status) status = override.status;
    else if (bookedKeys.has(slot.id)) status = 'Booked';

    merged.set(slot.id, {
      id: slot.id,
      date: slot.date,
      time: slot.time,
      timezone: slot.timezone,
      durationMinutes: slot.durationMinutes,
      status,
      generated: true,
      hasOverride: Boolean(override),
    });
  }

  for (const [id, override] of overrides.entries()) {
    if (merged.has(id)) continue;
    merged.set(id, {
      id,
      date: override.date,
      time: override.time,
      timezone: override.timezone || BOOKING_TIMEZONE,
      durationMinutes: override.durationMinutes || 60,
      status: override.status || 'Hidden',
      generated: false,
      hasOverride: true,
    });
  }

  return Array.from(merged.values()).sort((a, b) => {
    const dateCompare = String(a.date).localeCompare(String(b.date));
    if (dateCompare !== 0) return dateCompare;
    return String(a.time).localeCompare(String(b.time));
  });
};

export const countAvailableSlots = async () => (await getAvailableSlots()).length;
