import { FieldValue } from 'firebase-admin/firestore';
import { COLLECTIONS, getFirebaseAdmin } from './firebase-admin';
import type { CallBooking } from './types';

export class SlotUnavailableError extends Error {
  constructor(message = 'This time slot is no longer available.') {
    super(message);
    this.name = 'SlotUnavailableError';
  }
}

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
    if (!slotSnap.exists) {
      throw new SlotUnavailableError('Selected slot was not found.');
    }

    const slot = slotSnap.data() as {
      date: string;
      time: string;
      timezone: string;
      status: string;
    };

    if (slot.status !== 'Available') {
      throw new SlotUnavailableError();
    }

    transaction.update(slotRef, {
      status: 'Booked',
      updatedAt: FieldValue.serverTimestamp(),
    });

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
