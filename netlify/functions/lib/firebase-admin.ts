import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let app: App | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

const getPrivateKey = () => {
  const raw = process.env.FIREBASE_PRIVATE_KEY || '';
  return raw.replace(/\\n/g, '\n');
};

export const getFirebaseAdmin = () => {
  if (!app) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = getPrivateKey();

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Firebase admin credentials are not configured.');
    }

    app = getApps().length
      ? getApps()[0]
      : initializeApp({
          credential: cert({ projectId, clientEmail, privateKey }),
          projectId,
        });
  }

  if (!db) db = getFirestore(app);
  if (!auth) auth = getAuth(app);

  return { app, db, auth };
};

export const COLLECTIONS = {
  contactSubmissions: 'contactSubmissions',
  systemReviewSubmissions: 'systemReviewSubmissions',
  availabilitySlots: 'availabilitySlots',
  callBookings: 'callBookings',
  adminEmails: 'adminEmails',
} as const;
