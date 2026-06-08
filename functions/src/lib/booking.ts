import { FieldValue } from 'firebase-admin/firestore';
import { COLLECTIONS, getFirebaseAdmin } from './firebase-admin';
import {
  BOOKING_TIMEZONE,
  isValidGeneratedSlot,
  makeSlotId,
  parseSlotId,
} from './availability';
import type { CallBooking } from './types';

export class SlotUnavailableError extends Error {
  constructor(message = 'This time slot is no longer available.') {
    super(message);
    this.name = 'SlotUnavailableError';
  }
}

const resolveSlotDetails = (
  slotId: string,
  existing?: {
    date?: string;
    time?: string;
    timezone?: string;
    status?: string;
  },
) => {
  if (existing?.date && existing?.time) {
    return {
      date: existing.date,
      time: existing.time,
      timezone: existing.timezone || BOOKING_TIMEZONE,
      status: existing.status || 'Available',
    };
  }

  const parsed = parseSlotId(slotId);
  if (!parsed) {
    throw new SlotUnavailableError('Selected slot was not found.');
  }

  if (!isValidGeneratedSlot(parsed.date, parsed.time)) {
    throw new SlotUnavailableError('Selected slot is not valid.');
  }

  return {
    date: parsed.date,
    time: parsed.time,
    timezone: BOOKING_TIMEZONE,
    status: 'Available',
  };
};

export const bookSlotTransaction = async (params: {
  slotId: string;
  submissionId: string;
  clientName: string;
  clientEmail: string;
  ticketNumber?: string;
}) => {
  const { db } = getFirebaseAdmin();
  const slotRef = db.collection(COLLECTIONS.availabilitySlots).doc(params.slotId);

  return db.runTransaction(async (transaction) => {
    const slotSnap = await transaction.get(slotRef);
    const slot = resolveSlotDetails(
      params.slotId,
      slotSnap.exists ? (slotSnap.data() as { date?: string; time?: string; timezone?: string; status?: string }) : undefined,
    );

    if (slot.status === 'Booked' || slot.status === 'Hidden') {
      throw new SlotUnavailableError();
    }

    transaction.set(
      slotRef,
      {
        date: slot.date,
        time: slot.time,
        timezone: slot.timezone,
        durationMinutes: 60,
        status: 'Booked',
        updatedAt: FieldValue.serverTimestamp(),
        ...(slotSnap.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      },
      { merge: true },
    );

    const bookingRef = db.collection(COLLECTIONS.callBookings).doc();
    const booking: Omit<CallBooking, 'createdAt'> = {
      slotId: params.slotId,
      submissionId: params.submissionId,
      clientName: params.clientName,
      clientEmail: params.clientEmail,
      date: slot.date,
      time: slot.time,
      timezone: slot.timezone,
      ticketNumber: params.ticketNumber,
      status: 'confirmed',
    };

    transaction.set(bookingRef, {
      ...booking,
      createdAt: FieldValue.serverTimestamp(),
    });

    return { bookingId: bookingRef.id, slot, booking };
  });
};

export const blockDaySlots = async (date: string, timezone = BOOKING_TIMEZONE) => {
  const { db } = getFirebaseAdmin();
  const batch = db.batch();

  for (const hour of [9, 10, 11, 12, 13, 14]) {
    const time = `${String(hour).padStart(2, '0')}:00`;
    const slotId = makeSlotId(date, time);
    const ref = db.collection(COLLECTIONS.availabilitySlots).doc(slotId);
    batch.set(
      ref,
      {
        date,
        time,
        timezone,
        durationMinutes: 60,
        status: 'Hidden',
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  }

  await batch.commit();
};
