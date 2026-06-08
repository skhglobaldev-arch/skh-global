import { onRequest } from 'firebase-functions/v2/https';
import { app } from './app';

// Firebase Admin uses Application Default Credentials on Cloud Functions.
// FIREBASE_* secrets are only needed for local emulator / explicit service-account override.
const FUNCTION_SECRETS = [
  'ADMIN_EMAIL',
  'SMTP_USER',
  'SMTP_PASS',
  'SYSTEM_REVIEW_FROM_EMAIL',
  'SYSTEM_REVIEW_ADMIN_EMAIL',
] as const;

export const api = onRequest(
  {
    secrets: [...FUNCTION_SECRETS],
    memory: '256MiB',
    timeoutSeconds: 60,
    region: 'us-central1',
  },
  app,
);
