import { getFirebaseAdmin } from './firebase-admin';

export const getAdminEmail = () => (process.env.ADMIN_EMAIL || '').trim().toLowerCase();

export const verifyAdminToken = async (authorizationHeader?: string | null) => {
  const adminEmail = getAdminEmail();
  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL is not configured.');
  }

  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization token.');
  }

  const token = authorizationHeader.slice(7).trim();
  const { auth } = getFirebaseAdmin();
  const decoded = await auth.verifyIdToken(token);
  const email = (decoded.email || '').trim().toLowerCase();

  if (!email || email !== adminEmail) {
    throw new Error('Unauthorized: admin access only.');
  }

  return { uid: decoded.uid, email };
};

export const unauthorizedResponse = (message = 'Unauthorized') =>
  new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
