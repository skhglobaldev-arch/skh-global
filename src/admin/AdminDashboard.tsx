import React from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Mail,
  Paperclip,
  Phone,
  Send,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { getFirebaseAuth } from '../firebase/client';
import { BookingCalendar } from '../components/BookingCalendar';
import type { BookingSlot } from '../components/bookingUtils';
import { adminApi } from './api';

type Section = 'overview' | 'contacts' | 'reviews' | 'slots' | 'bookings' | 'settings';

const cardClass = 'rounded-2xl border border-white/10 bg-[#101827]/70 p-5 backdrop-blur-xl';
const inputClass = 'w-full rounded-xl border border-white/10 bg-[#050713]/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/45';
const btnGhost = 'rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white hover:border-cyan-300/25';
const btnPrimary = 'rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] px-4 py-2 text-xs font-black text-white shadow-[0_14px_40px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5';

type EmailTarget = {
  sourceType: 'contact' | 'review' | 'booking';
  sourceId: string;
  to: string;
  name?: string;
  label: string;
  ticketNumber?: string;
};

type EmailAttachment = {
  filename: string;
  contentType?: string;
  data: string;
};

const fileToAttachment = (file: File) =>
  new Promise<EmailAttachment>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve({
        filename: file.name,
        contentType: file.type || undefined,
        data: result.includes(',') ? result.split(',')[1] : result,
      });
    };
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });

const formatDate = (value?: string) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [section, setSection] = React.useState<Section>('overview');
  const [stats, setStats] = React.useState<Record<string, number> | null>(null);
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [slots, setSlots] = React.useState<any[]>([]);
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [settings, setSettings] = React.useState<Record<string, unknown> | null>(null);
  const [selectedContact, setSelectedContact] = React.useState<any | null>(null);
  const [selectedReview, setSelectedReview] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [selectedSlotDate, setSelectedSlotDate] = React.useState('');
  const [slotActionLoading, setSlotActionLoading] = React.useState(false);
  const [emailTarget, setEmailTarget] = React.useState<EmailTarget | null>(null);
  const [emailSubject, setEmailSubject] = React.useState('');
  const [emailMessage, setEmailMessage] = React.useState('');
  const [emailAttachments, setEmailAttachments] = React.useState<EmailAttachment[]>([]);
  const [emailHistory, setEmailHistory] = React.useState<any[]>([]);
  const [emailLoading, setEmailLoading] = React.useState(false);
  const [emailSending, setEmailSending] = React.useState(false);
  const [emailError, setEmailError] = React.useState('');
  const [emailSuccess, setEmailSuccess] = React.useState('');

  const loadSection = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (section === 'overview') setStats(await adminApi.stats());
      if (section === 'contacts') setContacts((await adminApi.contactList()).items || []);
      if (section === 'reviews') setReviews((await adminApi.reviewList()).items || []);
      if (section === 'slots') setSlots((await adminApi.slotsList()).items || []);
      if (section === 'bookings') setBookings((await adminApi.bookingsList()).items || []);
      if (section === 'settings') setSettings(await adminApi.settings());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [section]);

  React.useEffect(() => {
    loadSection();
  }, [loadSection]);

  const handleLogout = async () => {
    await signOut(getFirebaseAuth());
    navigate('/admin/login', { replace: true });
  };

  const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'contacts', label: 'Contact Forms', icon: <Mail size={16} /> },
    { id: 'reviews', label: 'System Reviews', icon: <FileText size={16} /> },
    { id: 'slots', label: 'Availability', icon: <Calendar size={16} /> },
    { id: 'bookings', label: 'Booked Calls', icon: <Phone size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  ];

  const contactStatuses = ['New', 'Reviewed', 'Call Booked', 'Replied', 'Archived'];
  const reviewStatuses = ['New', 'Needs Review', 'Call Booked', 'Proposal Draft', 'Replied', 'Archived'];

  const loadEmailHistory = React.useCallback(async (target: EmailTarget) => {
    setEmailLoading(true);
    setEmailError('');
    try {
      const result = await adminApi.emailHistory(target.sourceType, target.sourceId);
      setEmailHistory(result.items || []);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Failed to load email history');
    } finally {
      setEmailLoading(false);
    }
  }, []);

  const openEmailComposer = React.useCallback((target: EmailTarget) => {
    setEmailTarget(target);
    setEmailSubject(target.ticketNumber ? `Update for ${target.ticketNumber}` : 'Update from SKH.GLOBAL');
    setEmailMessage('');
    setEmailAttachments([]);
    setEmailHistory([]);
    setEmailError('');
    setEmailSuccess('');
    void loadEmailHistory(target);
  }, [loadEmailHistory]);

  const closeEmailComposer = () => {
    setEmailTarget(null);
    setEmailError('');
    setEmailSuccess('');
  };

  const handleEmailFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setEmailError('');
    try {
      const selected = Array.from(files).slice(0, 5);
      const attachments = await Promise.all(selected.map(fileToAttachment));
      setEmailAttachments(attachments);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Could not attach files');
    }
  };

  const sendAdminEmail = async () => {
    if (!emailTarget) return;
    if (!emailSubject.trim() || !emailMessage.trim()) {
      setEmailError('Subject and message are required.');
      return;
    }

    setEmailSending(true);
    setEmailError('');
    setEmailSuccess('');
    try {
      await adminApi.sendClientEmail({
        sourceType: emailTarget.sourceType,
        sourceId: emailTarget.sourceId,
        to: emailTarget.to,
        subject: emailSubject.trim(),
        message: emailMessage.trim(),
        attachments: emailAttachments,
      });
      if (emailTarget.sourceType === 'contact') {
        await updateContactStatus(emailTarget.sourceId, 'Replied');
      }
      if (emailTarget.sourceType === 'review') {
        await updateReviewStatus(emailTarget.sourceId, 'Replied');
      }
      setEmailSuccess('Email sent and saved to history.');
      setEmailMessage('');
      setEmailAttachments([]);
      await loadEmailHistory(emailTarget);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Email could not be sent');
    } finally {
      setEmailSending(false);
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    setError('');
    try {
      await adminApi.contactUpdate(id, { status });
      const updated = { ...selectedContact, status };
      setSelectedContact((current) => (current?.id === id ? { ...current, status } : current));
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      return null;
    }
  };

  const updateReviewStatus = async (id: string, status: string) => {
    setError('');
    try {
      await adminApi.reviewUpdate(id, { status });
      const updated = { ...selectedReview, status };
      setSelectedReview((current) => (current?.id === id ? { ...current, status } : current));
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      return null;
    }
  };
  const handleToggleSlot = async (slot: BookingSlot) => {
    if (slot.status === 'Booked') return;
    setSlotActionLoading(true);
    setError('');
    try {
      if (slot.status === 'Available') {
        await adminApi.slotCreate({
          date: slot.date,
          time: slot.time,
          timezone: slot.timezone,
          durationMinutes: 60,
          status: 'Hidden',
        });
      } else if (slot.hasOverride) {
        await adminApi.slotDelete(slot.id);
      } else {
        await adminApi.slotUpdate(slot.id, { status: 'Available' });
      }
      await loadSection();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update slot');
    } finally {
      setSlotActionLoading(false);
    }
  };

  const handleBlockDay = async (date: string) => {
    setSlotActionLoading(true);
    setError('');
    try {
      await adminApi.blockDay(date, 'Europe/London');
      await loadSection();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to block day');
    } finally {
      setSlotActionLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: 'New contacts', value: stats?.newContacts ?? 0, color: 'from-violet-500/20 to-blue-500/10' },
        { label: 'Pending reviews', value: stats?.pendingReviews ?? 0, color: 'from-cyan-500/20 to-blue-500/10' },
        { label: 'Upcoming calls', value: stats?.upcomingCalls ?? 0, color: 'from-purple-500/20 to-pink-500/10' },
        { label: 'Availability', value: 'Managed in calendar', color: 'from-emerald-500/20 to-cyan-500/10' },
      ].map((item) => (
        <div key={item.label} className={`${cardClass} bg-gradient-to-br ${item.color}`}>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
          <p className={`mt-3 font-black text-white ${typeof item.value === 'number' ? 'text-4xl' : 'text-lg'}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );

  const renderContacts = () => (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className={`${cardClass} overflow-hidden`}>
        <h2 className="mb-4 text-lg font-black text-white">Contact submissions</h2>
        <div className="max-h-[60vh] space-y-2 overflow-y-auto">
          {contacts.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedContact(item)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                selectedContact?.id === item.id ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/10 bg-[#050713]/50 hover:border-cyan-300/20'
              }`}
            >
              <div>
                <p className="font-bold text-white">{item.fullName || item.email}</p>
                <p className="text-xs text-slate-400">{item.company} · {item.ticketNumber}</p>
              </div>
              <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-bold uppercase text-cyan-200">{item.status}</span>
            </button>
          ))}
        </div>
      </div>
      {selectedContact ? (
        <div className={cardClass}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="text-lg font-black text-white">{selectedContact.fullName || selectedContact.email}</h3>
            <button
              type="button"
              className={`${btnPrimary} inline-flex items-center gap-2`}
              onClick={() => openEmailComposer({
                sourceType: 'contact',
                sourceId: selectedContact.id,
                to: selectedContact.email,
                name: selectedContact.fullName,
                label: selectedContact.fullName || selectedContact.company || selectedContact.email,
                ticketNumber: selectedContact.ticketNumber,
              })}
            >
              <Mail size={14} />
              Email
            </button>
          </div>
          <dl className="mt-4 space-y-2 text-sm text-slate-300">
            <div><dt className="text-slate-500">Email</dt><dd>{selectedContact.email}</dd></div>
            <div><dt className="text-slate-500">Company</dt><dd>{selectedContact.company}</dd></div>
            <div><dt className="text-slate-500">Budget</dt><dd>{selectedContact.investment}</dd></div>
            <div><dt className="text-slate-500">Focus</dt><dd className="whitespace-pre-wrap">{selectedContact.systemFocus}</dd></div>
            <div><dt className="text-slate-500">Submitted</dt><dd>{formatDate(selectedContact.createdAt)}</dd></div>
          </dl>
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">Status</span>
            <select
              className={inputClass}
              value={selectedContact.status || 'New'}
              onChange={(e) => { void updateContactStatus(selectedContact.id, e.target.value); }}
            >
              {contactStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">Internal notes</span>
            <textarea
              className={`${inputClass} min-h-28 resize-none`}
              value={selectedContact.adminNotes || ''}
              onChange={(e) => setSelectedContact({ ...selectedContact, adminNotes: e.target.value })}
              onBlur={async () => {
                try {
                  await adminApi.contactUpdate(selectedContact.id, { adminNotes: selectedContact.adminNotes || '' });
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Failed to save notes');
                }
              }}
            />
          </label>
        </div>
      ) : (
        <div className={`${cardClass} flex items-center justify-center text-slate-500`}>Select a submission</div>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className={cardClass}>
        <h2 className="mb-4 text-lg font-black text-white">System review requests</h2>
        <div className="max-h-[60vh] space-y-2 overflow-y-auto">
          {reviews.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedReview(item)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                selectedReview?.id === item.id ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/10 bg-[#050713]/50 hover:border-cyan-300/20'
              }`}
            >
              <div>
                <p className="font-bold text-white">{item.businessName || item.name}</p>
                <p className="text-xs text-slate-400">{item.email} · {item.ticketNumber}</p>
              </div>
              <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-bold uppercase text-cyan-200">{item.status}</span>
            </button>
          ))}
        </div>
      </div>
      {selectedReview ? (
        <div className={cardClass}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="text-lg font-black text-white">{selectedReview.businessName || selectedReview.name || selectedReview.email}</h3>
            <button
              type="button"
              className={`${btnPrimary} inline-flex items-center gap-2`}
              onClick={() => openEmailComposer({
                sourceType: 'review',
                sourceId: selectedReview.id,
                to: selectedReview.email,
                name: selectedReview.name,
                label: selectedReview.businessName || selectedReview.name || selectedReview.email,
                ticketNumber: selectedReview.ticketNumber,
              })}
            >
              <Mail size={14} />
              Email
            </button>
          </div>
          <dl className="mt-4 max-h-64 space-y-2 overflow-y-auto text-sm text-slate-300">
            {Object.entries(selectedReview.reviewSummary || {}).map(([key, value]) => (
              <div key={key}><dt className="text-slate-500">{key}</dt><dd className="whitespace-pre-wrap">{String(value)}</dd></div>
            ))}
            <div><dt className="text-slate-500">Next step</dt><dd>{selectedReview.preferredNextStep === 'call' ? 'Book a call' : 'Email response'}</dd></div>
            <div><dt className="text-slate-500">Submitted</dt><dd>{formatDate(selectedReview.createdAt)}</dd></div>
          </dl>
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">Status</span>
            <select
              className={inputClass}
              value={selectedReview.status || 'New'}
              onChange={(e) => { void updateReviewStatus(selectedReview.id, e.target.value); }}
            >
              {reviewStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">Internal notes</span>
            <textarea
              className={`${inputClass} min-h-28 resize-none`}
              value={selectedReview.adminNotes || ''}
              onChange={(e) => setSelectedReview({ ...selectedReview, adminNotes: e.target.value })}
              onBlur={async () => {
                try {
                  await adminApi.reviewUpdate(selectedReview.id, { adminNotes: selectedReview.adminNotes || '' });
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Failed to save notes');
                }
              }}
            />
          </label>
        </div>
      ) : (
        <div className={`${cardClass} flex items-center justify-center text-slate-500`}>Select a request</div>
      )}
    </div>
  );

  const renderSlots = () => (
    <div className="space-y-6">
      <div className={cardClass}>
        <h2 className="mb-2 text-lg font-black text-white">Availability calendar</h2>
        <p className="mb-5 text-xs leading-relaxed text-slate-400">
          Mon–Thu, 09:00–14:00 (hourly) in Europe/London are generated automatically for the next few weeks.
          Select a date, then click a time to block or restore it. Booked slots stay locked. Use “Block entire day” to hide all times on a date.
        </p>
        <div className="mb-4 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-wider">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-100">Available</span>
          <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-slate-400">Booked</span>
          <span className="rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1 text-red-100 line-through">Blocked</span>
        </div>
        <BookingCalendar
          mode="admin"
          slots={slots as BookingSlot[]}
          loading={loading || slotActionLoading}
          selectedDate={selectedSlotDate}
          onSelectDate={setSelectedSlotDate}
          onSelectSlot={() => undefined}
          onToggleSlot={handleToggleSlot}
          onBlockDay={handleBlockDay}
          labels={{
            selectDate: 'Select a working day',
            selectTime: 'Manage time slots',
            noSlots: 'No generated slots in the current booking window.',
            blockDay: 'Block entire day',
            clickToToggle: 'Click an available slot to block it, or a blocked slot to restore it.',
          }}
        />
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className={cardClass}>
      <h2 className="mb-4 text-lg font-black text-white">Booked calls</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-slate-500">
            <tr>
              <th className="pb-3">Client</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Time</th>
              <th className="pb-3">Ticket</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-white/10">
                <td className="py-3">
                  <p className="font-bold text-white">{b.clientName}</p>
                  <p className="text-xs text-slate-500">{b.clientEmail}</p>
                </td>
                <td className="py-3">{b.date}</td>
                <td className="py-3">{b.time} ({b.timezone})</td>
                <td className="py-3 text-cyan-200">{b.ticketNumber || '—'}</td>
                <td className="py-3">
                  <button
                    type="button"
                    className={`${btnGhost} inline-flex items-center gap-2`}
                    onClick={() => openEmailComposer({
                      sourceType: 'booking',
                      sourceId: b.id,
                      to: b.clientEmail,
                      name: b.clientName,
                      label: b.clientName || b.clientEmail,
                      ticketNumber: b.ticketNumber,
                    })}
                  >
                    <Mail size={13} />
                    Email
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className={cardClass}>
      <h2 className="mb-4 text-lg font-black text-white">Environment status</h2>
      <dl className="space-y-3 text-sm text-slate-300">
        <div className="flex justify-between border-b border-white/10 pb-2"><dt>Admin email configured</dt><dd>{settings?.adminEmailConfigured ? 'Yes' : 'No'}</dd></div>
        <div className="flex justify-between border-b border-white/10 pb-2"><dt>SMTP configured</dt><dd>{settings?.smtpConfigured ? 'Yes' : 'No'}</dd></div>
        <div className="flex justify-between"><dt>Site URL</dt><dd>{String(settings?.siteUrl || '—')}</dd></div>
      </dl>
      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        Configure ADMIN_EMAIL, SMTP_* vars, Firebase admin credentials, and VITE_FIREBASE_* in Netlify environment variables.
      </p>
    </div>
  );

  const renderEmailComposer = () => {
    if (!emailTarget) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050713]/80 p-4 backdrop-blur-xl">
        <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-cyan-300/16 bg-[#101827]/95 p-5 shadow-[0_30px_120px_rgba(5,7,19,0.75)] md:p-7">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Client email</p>
              <h2 className="text-2xl font-black text-white">Email {emailTarget.label}</h2>
              <p className="mt-2 text-sm text-slate-400">
                To: <span className="text-cyan-100">{emailTarget.to}</span>
                {emailTarget.ticketNumber ? <span> · {emailTarget.ticketNumber}</span> : null}
              </p>
            </div>
            <button type="button" onClick={closeEmailComposer} className={`${btnGhost} inline-flex items-center gap-2`}>
              <X size={14} />
              Close
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">Recipient</span>
                <input className={`${inputClass} text-slate-400`} value={emailTarget.to} readOnly />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">Subject</span>
                <input
                  className={inputClass}
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">Message</span>
                <textarea
                  className={`${inputClass} min-h-56 resize-y leading-relaxed`}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Write your email here. It will be sent inside the SKH.GLOBAL branded HTML template."
                />
              </label>

              <div className="rounded-2xl border border-white/10 bg-[#050713]/50 p-4">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white transition hover:border-cyan-300/25">
                  <Paperclip size={14} />
                  Attach files
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => { void handleEmailFiles(e.target.files); e.currentTarget.value = ''; }}
                  />
                </label>
                {emailAttachments.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {emailAttachments.map((file) => (
                      <span key={file.filename} className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-1 text-xs text-cyan-100">
                        {file.filename}
                      </span>
                    ))}
                    <button type="button" className="text-xs font-bold text-slate-400 hover:text-white" onClick={() => setEmailAttachments([])}>
                      Clear
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-slate-500">Optional. Up to 5 files per email.</p>
                )}
              </div>

              {emailError ? <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{emailError}</p> : null}
              {emailSuccess ? <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{emailSuccess}</p> : null}

              <button
                type="button"
                disabled={emailSending}
                onClick={() => { void sendAdminEmail(); }}
                className={`${btnPrimary} inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <Send size={14} />
                {emailSending ? 'Sending...' : 'Send email'}
              </button>
            </div>

            <div className="rounded-2xl border border-violet-400/14 bg-[#050713]/48 p-4">
              <div className="mb-4 flex items-center gap-2">
                <History size={15} className="text-cyan-200" />
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Email history</h3>
              </div>
              {emailLoading ? (
                <div className="flex h-24 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
                </div>
              ) : emailHistory.length ? (
                <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                  {emailHistory.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-[#101827]/72 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-bold text-white">{item.subject}</p>
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2 py-1 text-[10px] font-bold text-emerald-100">
                          {item.status || 'Sent'}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{formatDate(item.sentAt || item.createdAt)}</p>
                      <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{item.message}</p>
                      {Array.isArray(item.attachmentNames) && item.attachmentNames.length ? (
                        <p className="mt-3 text-xs text-cyan-200">Attachments: {item.attachmentNames.join(', ')}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center text-sm text-slate-500">
                  No emails sent to this client from this record yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const sectionRenderers: Record<Section, () => React.ReactNode> = {
    overview: renderOverview,
    contacts: renderContacts,
    reviews: renderReviews,
    slots: renderSlots,
    bookings: renderBookings,
    settings: renderSettings,
  };

  return (
    <div className="min-h-screen bg-[#050713] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(124,58,237,0.12),transparent_36%),radial-gradient(circle_at_100%_20%,rgba(56,216,255,0.08),transparent_34%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row">
        <aside className="lg:w-64">
          <div className={`${cardClass} sticky top-8 border-violet-400/20`}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#38D8FF]">
                <Users size={18} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-cyan-200">SKH Admin</p>
                <p className="text-sm text-slate-400">Internal panel</p>
              </div>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setSection(item.id); setSelectedContact(null); setSelectedReview(null); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                    section === item.id ? 'bg-cyan-300/10 text-cyan-100' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
            <button type="button" onClick={handleLogout} className={`${btnGhost} mt-6 flex w-full items-center justify-center gap-2`}>
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-black capitalize">{section === 'contacts' ? 'Contact Forms' : section === 'reviews' ? 'System Review Requests' : section}</h1>
            <button type="button" onClick={loadSection} className={btnGhost}>Refresh</button>
          </div>
          {error ? <p className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
            </div>
          ) : (
            sectionRenderers[section]()
          )}
          {renderEmailComposer()}
        </main>
      </div>
    </div>
  );
};
