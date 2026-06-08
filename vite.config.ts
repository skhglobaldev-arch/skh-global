import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const REQUIRED_FIREBASE_CLIENT_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const missingFirebaseKeys = REQUIRED_FIREBASE_CLIENT_KEYS.filter((key) => !env[key]?.trim());

  if (missingFirebaseKeys.length > 0) {
    console.warn(
      `[vite] Missing Firebase client env vars: ${missingFirebaseKeys.join(', ')}. ` +
        'Admin login will fail until they are set and the app is rebuilt.',
    );
  }

  return {
    envDir: process.cwd(),
    server: {
      port: 3001,
      host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
