import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const FIREBASE_ENV_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

const isNonEmptyEnv = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const getMissingFirebaseEnvKeys = () =>
  FIREBASE_ENV_KEYS.filter((key) => !isNonEmptyEnv(import.meta.env[key]));

const isLocalDevHost = () => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
};

const isNetlifyDeployment = () => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'skh.global' || host.endsWith('.netlify.app');
};

export const getFirebaseConfigHelpMessage = () => {
  const missing = getMissingFirebaseEnvKeys();
  const missingList = missing.length ? missing.join(', ') : 'required VITE_FIREBASE_* keys';

  if (isLocalDevHost()) {
    return `Firebase is not configured (${missingList}). Add these to .env.local, then restart the dev server (npm run dev).`;
  }

  if (isNetlifyDeployment()) {
    return `Firebase is not configured (${missingList}). In Netlify → Site settings → Environment variables, add all VITE_FIREBASE_* values, then trigger a new deploy (Clear cache and deploy site). Vite bakes these into the build at compile time.`;
  }

  return `Firebase is not configured (${missingList}). Set VITE_FIREBASE_* environment variables and rebuild the site.`;
};

export const isFirebaseConfigured = () =>
  Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );

export const getFirebaseApp = () => {
  if (!isFirebaseConfigured()) {
    throw new Error(getFirebaseConfigHelpMessage());
  }
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
};

export const getFirebaseAuth = () => {
  if (!auth) auth = getAuth(getFirebaseApp());
  return auth;
};
