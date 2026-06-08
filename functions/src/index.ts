import { onRequest } from 'firebase-functions/v2/https';
import { app } from './app';

const FUNCTION_SECRETS = [
  'ADMIN_EMAIL',
  'SMTP_USER',
  'SMTP_PASS',
  'SYSTEM_REVIEW_FROM_EMAIL',
  'SYSTEM_REVIEW_ADMIN_EMAIL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
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
