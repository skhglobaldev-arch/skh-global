export type ContactStatus = 'New' | 'Reviewed' | 'Call Booked' | 'Replied' | 'Archived';
export type SystemReviewStatus = 'New' | 'Needs Review' | 'Call Booked' | 'Proposal Draft' | 'Replied' | 'Archived';
export type SlotStatus = 'Available' | 'Booked' | 'Hidden';
export type PreferredNextStep = 'call' | 'email';

export type ContactSubmission = {
  fullName: string;
  company: string;
  email: string;
  investment: string;
  systemFocus: string;
  ticketNumber: string;
  currentLanguage?: string;
  status?: ContactStatus;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SystemReviewSubmission = {
  name: string;
  businessName: string;
  email: string;
  phone?: string;
  website?: string;
  businessType?: string;
  businessTypeLabel?: string;
  channels?: string;
  channelsLabel?: string;
  painPoint?: string;
  painPointLabel?: string;
  volume?: string;
  volumeLabel?: string;
  ticketNumber: string;
  currentLanguage?: string;
  review?: Record<string, unknown>;
  reviewSummary?: Record<string, string>;
  preferredNextStep?: PreferredNextStep;
  selectedSlotId?: string;
  status?: SystemReviewStatus;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AvailabilitySlot = {
  date: string;
  time: string;
  timezone: string;
  durationMinutes?: number;
  status: SlotStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type CallBooking = {
  slotId: string;
  submissionId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  timezone: string;
  ticketNumber?: string;
  status?: string;
  createdAt?: string;
};

export type AdminEmailSourceType = 'contact' | 'review' | 'booking';

export type AdminEmailAttachment = {
  filename: string;
  contentType?: string;
  data: string;
};
