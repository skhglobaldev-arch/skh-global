import { FieldValue } from 'firebase-admin/firestore';
import { COLLECTIONS, getFirebaseAdmin } from './firebase-admin';
import { verifyAdminToken } from './auth';
import {
  BOOKING_TIMEZONE,
  countAvailableSlots,
  getAdminMergedSlots,
  getAvailableSlots,
  makeSlotId,
} from './availability';
import { blockDaySlots, bookSlotTransaction, SlotUnavailableError } from './booking';
import {
  sendCallBookedEmail,
  sendContactConfirmation,
  sendEmailResponseConfirmation,
  sendInternalNotification,
} from './mail';
import type {
  AvailabilitySlot,
  ContactStatus,
  ContactSubmission,
  PreferredNextStep,
  SlotStatus,
  SystemReviewStatus,
  SystemReviewSubmission,
} from './types';

const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const serializeDoc = (id: string, data: Record<string, unknown>) => {
  const out: Record<string, unknown> = { id, ...data };
  for (const key of ['createdAt', 'updatedAt']) {
    const val = out[key];
    if (val && typeof val === 'object' && 'toDate' in (val as object)) {
      out[key] = (val as { toDate: () => Date }).toDate().toISOString();
    }
  }
  return out;
};

export const handleAuditPost = async (request: Request) => {
  const submission = (await request.json()) as SystemReviewSubmission & {
    preferredNextStep?: PreferredNextStep;
    selectedSlotId?: string;
  };

  if (!submission.email) return json({ error: 'Email is required' }, 400);

  const { db } = getFirebaseAdmin();
  const ticketNumber = submission.ticketNumber || `SKH-${Date.now().toString().slice(-8)}`;
  const preferredNextStep = submission.preferredNextStep || 'email';
  const initialStatus: SystemReviewStatus = preferredNextStep === 'call' ? 'Call Booked' : 'New';

  const docRef = await db.collection(COLLECTIONS.systemReviewSubmissions).add({
    ...submission,
    ticketNumber,
    preferredNextStep,
    status: initialStatus,
    adminNotes: '',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  let bookingDetails: { date: string; time: string; timezone: string } | null = null;

  if (preferredNextStep === 'call') {
    if (!submission.selectedSlotId) {
      return json({ error: 'A time slot is required when booking a call.' }, 400);
    }

    try {
      const result = await bookSlotTransaction({
        slotId: submission.selectedSlotId,
        submissionId: docRef.id,
        clientName: submission.name || submission.reviewSummary?.name || 'Client',
        clientEmail: submission.email,
        ticketNumber,
      });
      bookingDetails = {
        date: result.slot.date,
        time: result.slot.time,
        timezone: result.slot.timezone,
      };
    } catch (error) {
      if (error instanceof SlotUnavailableError) {
        return json({ error: error.message }, 409);
      }
      throw error;
    }
  }

  const review = submission.reviewSummary || {};
  const internalFields: Record<string, string | undefined> = {
    Type: 'System Review',
    Name: submission.name || review.name,
    Business: submission.businessName,
    Email: submission.email,
    'Preferred Next Step': preferredNextStep === 'call' ? 'Book a call' : 'Email response',
    'Business Type': submission.businessTypeLabel || submission.businessType,
    'Main Problem': submission.painPointLabel || submission.painPoint,
    Budget: review.budget,
    Timeline: review.timeline,
    Ticket: ticketNumber,
    ...(bookingDetails
      ? {
          'Call Date': bookingDetails.date,
          'Call Time': `${bookingDetails.time} (${bookingDetails.timezone})`,
        }
      : {}),
  };

  await sendInternalNotification({
    subject: `New System Review: ${submission.businessName || submission.email} (#${ticketNumber})`,
    fields: internalFields,
  });

  const clientName = submission.name || review.name || 'there';

  if (preferredNextStep === 'call' && bookingDetails) {
    await sendCallBookedEmail({
      to: submission.email,
      clientName,
      date: bookingDetails.date,
      time: bookingDetails.time,
      timezone: bookingDetails.timezone,
      ticketNumber,
    });
  } else {
    await sendEmailResponseConfirmation({
      to: submission.email,
      clientName,
      ticketNumber,
    });
  }

  return json({ success: true, ticketId: ticketNumber, submissionId: docRef.id });
};

export const handleContactPost = async (request: Request) => {
  const submission = (await request.json()) as ContactSubmission;
  if (!submission.email) return json({ error: 'Email is required' }, 400);

  const { db } = getFirebaseAdmin();
  const ticketNumber = submission.ticketNumber || `SKH-${Date.now().toString().slice(-8)}`;

  await db.collection(COLLECTIONS.contactSubmissions).add({
    fullName: submission.fullName || '',
    company: submission.company || '',
    email: submission.email,
    investment: submission.investment || '',
    systemFocus: submission.systemFocus || '',
    ticketNumber,
    currentLanguage: submission.currentLanguage || 'en',
    status: 'New' as ContactStatus,
    adminNotes: '',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  await sendInternalNotification({
    subject: `New Contact Inquiry: ${submission.company || submission.fullName || submission.email} (#${ticketNumber})`,
    fields: {
      Type: 'Contact Form',
      Name: submission.fullName,
      Email: submission.email,
      Company: submission.company,
      Budget: submission.investment,
      Focus: submission.systemFocus,
      Ticket: ticketNumber,
    },
  });

  await sendContactConfirmation({
    to: submission.email,
    clientName: submission.fullName || 'there',
    ticketNumber,
  });

  return json({ success: true, ticketId: ticketNumber });
};

export const handleAvailabilityGet = async () => {
  const slots = await getAvailableSlots();
  return json({ slots });
};

export const handleBookSlotPost = async (request: Request) => {
  const body = (await request.json()) as {
    slotId?: string;
    submissionId?: string;
    clientName?: string;
    clientEmail?: string;
    ticketNumber?: string;
  };

  if (!body.slotId || !body.submissionId || !body.clientEmail) {
    return json({ error: 'slotId, submissionId, and clientEmail are required.' }, 400);
  }

  try {
    const result = await bookSlotTransaction({
      slotId: body.slotId,
      submissionId: body.submissionId,
      clientName: body.clientName || 'Client',
      clientEmail: body.clientEmail,
      ticketNumber: body.ticketNumber,
    });

    await sendCallBookedEmail({
      to: body.clientEmail,
      clientName: body.clientName || 'there',
      date: result.slot.date,
      time: result.slot.time,
      timezone: result.slot.timezone,
      ticketNumber: body.ticketNumber,
    });

    return json({ success: true, bookingId: result.bookingId, slot: result.slot });
  } catch (error) {
    if (error instanceof SlotUnavailableError) {
      return json({ error: error.message }, 409);
    }
    throw error;
  }
};

const parseAdminPath = (url: string) => {
  const pathname = new URL(url).pathname.replace(/\/+$/, '');
  const base = '/api/admin';
  if (!pathname.startsWith(base)) return { resource: '', id: '', action: '' };
  const rest = pathname.slice(base.length).replace(/^\//, '');
  const parts = rest.split('/').filter(Boolean);
  return { resource: parts[0] || '', id: parts[1] || '', action: parts[2] || '' };
};

export const handleAdminRequest = async (request: Request) => {
  try {
    await verifyAdminToken(request.headers.get('authorization'));
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unauthorized' }, 401);
  }

  const { resource, id } = parseAdminPath(request.url);
  const { db } = getFirebaseAdmin();
  const method = request.method;

  if (resource === 'verify' && method === 'GET') {
    return json({ ok: true });
  }

  if (resource === 'stats' && method === 'GET') {
    const [contacts, reviews, bookings, availableSlots] = await Promise.all([
      db.collection(COLLECTIONS.contactSubmissions).where('status', '==', 'New').get(),
      db.collection(COLLECTIONS.systemReviewSubmissions).where('status', 'in', ['New', 'Needs Review']).get(),
      db.collection(COLLECTIONS.callBookings).get(),
      countAvailableSlots(),
    ]);

    const upcomingCalls = bookings.docs.filter((doc) => {
      const data = doc.data();
      return data.date >= new Date().toISOString().slice(0, 10);
    }).length;

    return json({
      newContacts: contacts.size,
      pendingReviews: reviews.size,
      upcomingCalls,
      availableSlots,
      totalBookings: bookings.size,
    });
  }

  if (resource === 'contact-submissions') {
    if (method === 'GET' && !id) {
      const snapshot = await db.collection(COLLECTIONS.contactSubmissions).orderBy('createdAt', 'desc').limit(100).get();
      return json({ items: snapshot.docs.map((doc) => serializeDoc(doc.id, doc.data() as Record<string, unknown>)) });
    }
    if (method === 'GET' && id) {
      const doc = await db.collection(COLLECTIONS.contactSubmissions).doc(id).get();
      if (!doc.exists) return json({ error: 'Not found' }, 404);
      return json(serializeDoc(doc.id, doc.data() as Record<string, unknown>));
    }
    if (method === 'PATCH' && id) {
      const body = (await request.json()) as { status?: ContactStatus; adminNotes?: string };
      await db.collection(COLLECTIONS.contactSubmissions).doc(id).update({
        ...(body.status ? { status: body.status } : {}),
        ...(body.adminNotes !== undefined ? { adminNotes: body.adminNotes } : {}),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return json({ success: true });
    }
  }

  if (resource === 'system-review-submissions') {
    if (method === 'GET' && !id) {
      const snapshot = await db.collection(COLLECTIONS.systemReviewSubmissions).orderBy('createdAt', 'desc').limit(100).get();
      return json({ items: snapshot.docs.map((doc) => serializeDoc(doc.id, doc.data() as Record<string, unknown>)) });
    }
    if (method === 'GET' && id) {
      const doc = await db.collection(COLLECTIONS.systemReviewSubmissions).doc(id).get();
      if (!doc.exists) return json({ error: 'Not found' }, 404);
      return json(serializeDoc(doc.id, doc.data() as Record<string, unknown>));
    }
    if (method === 'PATCH' && id) {
      const body = (await request.json()) as { status?: SystemReviewStatus; adminNotes?: string };
      await db.collection(COLLECTIONS.systemReviewSubmissions).doc(id).update({
        ...(body.status ? { status: body.status } : {}),
        ...(body.adminNotes !== undefined ? { adminNotes: body.adminNotes } : {}),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return json({ success: true });
    }
  }

  if (resource === 'slots') {
    if (method === 'GET' && !id) {
      const items = await getAdminMergedSlots();
      return json({ items });
    }
    if (method === 'POST' && id === 'block-day') {
      const body = (await request.json()) as { date?: string; timezone?: string };
      if (!body.date) return json({ error: 'date is required.' }, 400);
      await blockDaySlots(body.date, body.timezone || BOOKING_TIMEZONE);
      return json({ success: true });
    }
    if (method === 'POST' && !id) {
      const body = (await request.json()) as AvailabilitySlot;
      if (!body.date || !body.time) {
        return json({ error: 'date and time are required.' }, 400);
      }
      const timezone = body.timezone || BOOKING_TIMEZONE;
      const slotId = makeSlotId(body.date, body.time);
      await db.collection(COLLECTIONS.availabilitySlots).doc(slotId).set({
        date: body.date,
        time: body.time,
        timezone,
        durationMinutes: body.durationMinutes || 60,
        status: (body.status || 'Hidden') as SlotStatus,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      return json({ success: true, id: slotId });
    }
    if (method === 'PATCH' && id) {
      const body = (await request.json()) as Partial<AvailabilitySlot>;
      await db.collection(COLLECTIONS.availabilitySlots).doc(id).update({
        ...(body.date ? { date: body.date } : {}),
        ...(body.time ? { time: body.time } : {}),
        ...(body.timezone ? { timezone: body.timezone } : {}),
        ...(body.durationMinutes !== undefined ? { durationMinutes: body.durationMinutes } : {}),
        ...(body.status ? { status: body.status } : {}),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return json({ success: true });
    }
    if (method === 'DELETE' && id) {
      await db.collection(COLLECTIONS.availabilitySlots).doc(id).delete();
      return json({ success: true });
    }
  }

  if (resource === 'bookings' && method === 'GET') {
    const snapshot = await db.collection(COLLECTIONS.callBookings).orderBy('createdAt', 'desc').limit(100).get();
    return json({ items: snapshot.docs.map((doc) => serializeDoc(doc.id, doc.data() as Record<string, unknown>)) });
  }

  if (resource === 'settings' && method === 'GET') {
    return json({
      adminEmailConfigured: !!process.env.ADMIN_EMAIL,
      smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
      siteUrl: process.env.SITE_URL || process.env.URL || '',
    });
  }

  return json({ error: 'Not found' }, 404);
};
