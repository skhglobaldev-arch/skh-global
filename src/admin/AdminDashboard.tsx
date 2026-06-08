import React from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Phone,
  Settings,
  Users,
} from 'lucide-react';
import { getFirebaseAuth } from '../firebase/client';
import { adminApi } from './api';

type Section = 'overview' | 'contacts' | 'reviews' | 'slots' | 'bookings' | 'settings';

const cardClass = 'rounded-2xl border border-white/10 bg-[#101827]/70 p-5 backdrop-blur-xl';
const inputClass = 'w-full rounded-xl border border-white/10 bg-[#050713]/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/45';
const btnPrimary = 'rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] px-4 py-2 text-xs font-black uppercase tracking-wider text-white';
const btnGhost = 'rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white hover:border-cyan-300/25';

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
  const [slotForm, setSlotForm] = React.useState({
    date: '',
    time: '',
    timezone: 'Europe/London',
    durationMinutes: 30,
    status: 'Available',
  });

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

  const contactStatuses = ['New', 'Reviewed', 'Replied', 'Archived'];
  const reviewStatuses = ['New', 'Needs Review', 'Call Booked', 'Proposal Draft', 'Replied', 'Archived'];
  const slotStatuses = ['Available', 'Booked', 'Hidden'];

  const renderOverview = () => (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: 'New contacts', value: stats?.newContacts ?? 0, color: 'from-violet-500/20 to-blue-500/10' },
        { label: 'Pending reviews', value: stats?.pendingReviews ?? 0, color: 'from-cyan-500/20 to-blue-500/10' },
        { label: 'Upcoming calls', value: stats?.upcomingCalls ?? 0, color: 'from-purple-500/20 to-pink-500/10' },
        { label: 'Available slots', value: stats?.availableSlots ?? 0, color: 'from-emerald-500/20 to-cyan-500/10' },
      ].map((item) => (
        <div key={item.label} className={`${cardClass} bg-gradient-to-br ${item.color}`}>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
          <p className="mt-3 text-4xl font-black text-white">{item.value}</p>
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
          <h3 className="text-lg font-black text-white">{selectedContact.fullName}</h3>
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
              value={selectedContact.status}
              onChange={async (e) => {
                await adminApi.contactUpdate(selectedContact.id, { status: e.target.value });
                const updated = { ...selectedContact, status: e.target.value };
                setSelectedContact(updated);
                setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
              }}
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
                await adminApi.contactUpdate(selectedContact.id, { adminNotes: selectedContact.adminNotes || '' });
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
          <h3 className="text-lg font-black text-white">{selectedReview.businessName}</h3>
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
              value={selectedReview.status}
              onChange={async (e) => {
                await adminApi.reviewUpdate(selectedReview.id, { status: e.target.value });
                const updated = { ...selectedReview, status: e.target.value };
                setSelectedReview(updated);
                setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
              }}
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
                await adminApi.reviewUpdate(selectedReview.id, { adminNotes: selectedReview.adminNotes || '' });
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
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className={cardClass}>
        <h2 className="mb-4 text-lg font-black text-white">Add slot</h2>
        <div className="space-y-3">
          <input type="date" className={inputClass} value={slotForm.date} onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })} />
          <input type="time" className={inputClass} value={slotForm.time} onChange={(e) => setSlotForm({ ...slotForm, time: e.target.value })} />
          <input className={inputClass} value={slotForm.timezone} onChange={(e) => setSlotForm({ ...slotForm, timezone: e.target.value })} placeholder="Timezone" />
          <select className={inputClass} value={slotForm.status} onChange={(e) => setSlotForm({ ...slotForm, status: e.target.value })}>
            {slotStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            type="button"
            className={btnPrimary}
            onClick={async () => {
              await adminApi.slotCreate(slotForm);
              setSlotForm({ date: '', time: '', timezone: 'Europe/London', durationMinutes: 30, status: 'Available' });
              loadSection();
            }}
          >
            Create slot
          </button>
        </div>
      </div>
      <div className={cardClass}>
        <h2 className="mb-4 text-lg font-black text-white">All slots</h2>
        <div className="max-h-[60vh] space-y-2 overflow-y-auto">
          {slots.map((slot) => (
            <div key={slot.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#050713]/50 px-4 py-3">
              <div>
                <p className="font-bold text-white">{slot.date} · {slot.time}</p>
                <p className="text-xs text-slate-400">{slot.timezone} · {slot.status}</p>
              </div>
              <div className="flex gap-2">
                <select
                  className="rounded-lg border border-white/10 bg-[#101827] px-2 py-1 text-xs text-white"
                  value={slot.status}
                  onChange={async (e) => {
                    await adminApi.slotUpdate(slot.id, { status: e.target.value });
                    loadSection();
                  }}
                >
                  {slotStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="button" className={btnGhost} onClick={async () => { await adminApi.slotDelete(slot.id); loadSection(); }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
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
        </main>
      </div>
    </div>
  );
};
