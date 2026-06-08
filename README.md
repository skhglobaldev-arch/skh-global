# SKH.GLOBAL

Premium digital systems studio website with secure admin panel, Firestore-backed submissions, and Resend email notifications.

## Run locally

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and fill in values
3. Start dev server: `npm run dev`
4. Build: `npm run build`

## Admin panel

- Login: `/#/admin/login`
- Dashboard: `/#/admin` (Firebase Auth + server-side `ADMIN_EMAIL` check)

## Environment variables

See `.env.example` for the full list. Set these in Netlify (Site settings → Environment variables) for production.

**Server only (never expose in frontend):**
- `ADMIN_EMAIL`
- `RESEND_API_KEY`, `SYSTEM_REVIEW_FROM_EMAIL`, `SYSTEM_REVIEW_ADMIN_EMAIL`
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- `SKH_LOGO_URL`, `SITE_URL`

**Frontend (Vite public):**
- `VITE_FIREBASE_*` client SDK config

## Firebase setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication** → Email/Password
3. Create an admin user with the same email as `ADMIN_EMAIL`
4. Enable **Firestore** (production mode)
5. Deploy rules: `firebase deploy --only firestore:rules` (requires Firebase CLI + `firebase.json`)
6. Create a service account key (Project settings → Service accounts → Generate new private key)
7. Add `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` to Netlify env
8. Add web app config as `VITE_FIREBASE_*` variables

### Firestore collections

- `contactSubmissions`
- `systemReviewSubmissions`
- `availabilitySlots`
- `callBookings`

All collections are **deny-all** for client SDK reads/writes (`firestore.rules`). Only Netlify functions (Admin SDK) access data.

### Composite index

If availability queries fail, create a Firestore composite index for:
- Collection: `availabilitySlots`
- Fields: `status` Asc, `date` Asc, `time` Asc

Firebase Console will provide a direct link when the first query runs.

## Resend setup

1. Create account at https://resend.com
2. Verify your sending domain
3. Set `RESEND_API_KEY` and `SYSTEM_REVIEW_FROM_EMAIL` (e.g. `SKH.GLOBAL <noreply@yourdomain.com>`)
4. Set `SYSTEM_REVIEW_ADMIN_EMAIL` for internal notifications

## Netlify deployment

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- API routes are redirected in `netlify.toml`

## Security notes

- Gemini API key is **not** bundled in the frontend (`vite.config.ts` define removed)
- Admin APIs require a valid Firebase ID token matching `ADMIN_EMAIL`
- Clients cannot read other clients' submissions (Firestore rules + server-only access)
