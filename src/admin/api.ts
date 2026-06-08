import { getFirebaseAuth } from '../firebase/client';

const getToken = async () => {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
};

const adminFetch = async (path: string, options: RequestInit = {}) => {
  const token = await getToken();
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${response.status})`);
  }

  return response.json();
};

export const adminApi = {
  verify: () => adminFetch('/api/admin/verify'),
  stats: () => adminFetch('/api/admin/stats'),
  contactList: () => adminFetch('/api/admin/contact-submissions'),
  contactGet: (id: string) => adminFetch(`/api/admin/contact-submissions/${id}`),
  contactUpdate: (id: string, data: { status?: string; adminNotes?: string }) =>
    adminFetch(`/api/admin/contact-submissions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  reviewList: () => adminFetch('/api/admin/system-review-submissions'),
  reviewGet: (id: string) => adminFetch(`/api/admin/system-review-submissions/${id}`),
  reviewUpdate: (id: string, data: { status?: string; adminNotes?: string }) =>
    adminFetch(`/api/admin/system-review-submissions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  slotsList: () => adminFetch('/api/admin/slots'),
  slotCreate: (data: Record<string, unknown>) =>
    adminFetch('/api/admin/slots', { method: 'POST', body: JSON.stringify(data) }),
  slotUpdate: (id: string, data: Record<string, unknown>) =>
    adminFetch(`/api/admin/slots/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  slotDelete: (id: string) => adminFetch(`/api/admin/slots/${id}`, { method: 'DELETE' }),
  bookingsList: () => adminFetch('/api/admin/bookings'),
  settings: () => adminFetch('/api/admin/settings'),
};

export const fetchAvailableSlots = async () => {
  const response = await fetch('/api/availability');
  if (!response.ok) throw new Error('Failed to load available slots');
  return response.json() as Promise<{ slots: Array<{ id: string; date: string; time: string; timezone: string }> }>;
};
