# SKH.GLOBAL

Premium digital systems studio website with secure admin panel, Firestore-backed submissions, and Gmail SMTP email notifications.

Hosted on **Firebase Hosting** with **Cloud Functions** (v2 HTTPS) for all `/api/*` routes.

## Run locally

1. Install dependencies: `npm install` and `npm install --prefix functions`
2. Copy `.env.example` to `.env.local` and fill in values
3. Start dev server: `npm run dev` (Vite + Express API on port 3001)
4. Build frontend: `npm run build`

### Firebase emulators (optional)

To test Cloud Functions + Hosting locally:

```bash
npm run build
npm run build:functions
firebase emulators:start
```

Hosting emulator: http://localhost:5000 — Functions emulator: http://localhost:5001

For the functions emulator, copy secrets into `functions/.env` (see `.env.example`) or use `firebase functions:secrets:access` during development.

## Admin panel

- Login: `/#/admin/login`
- Dashboard: `/#/admin` (Firebase Auth + server-side `ADMIN_EMAIL` check)

## Environment variables

See `.env.example` for the full list.

**Server only (Cloud Functions secrets — never expose in frontend):**

| Variable | Purpose |
| --- | --- |
| `ADMIN_EMAIL` | Firebase Auth email allowed to access admin APIs |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Gmail SMTP |
| `SYSTEM_REVIEW_FROM_EMAIL` | From address for outbound emails |
| `SYSTEM_REVIEW_ADMIN_EMAIL` | Internal notification recipient |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Firebase Admin SDK (optional on Cloud Functions — ADC is used when omitted) |
| `SITE_URL`, `SKH_LOGO_URL` | Branding links in emails |

**Frontend (Vite — baked at build time):**

| Variable | Purpose |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase web app config |
| `VITE_FIREBASE_AUTH_DOMAIN` | `{project-id}.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `{project-id}.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase web app config |
| `VITE_FIREBASE_APP_ID` | Firebase web app config |
| `VITE_FIREBASE_MEASUREMENT_ID` | Optional Analytics ID |

Set frontend vars in `.env.production` or CI before `npm run build`. After changing `VITE_*` vars, rebuild and redeploy hosting.

## Firebase setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication** → Email/Password
3. Create an admin user with the same email as `ADMIN_EMAIL`
4. Enable **Firestore** (production mode)
5. Deploy rules: `firebase deploy --only firestore:rules`
6. Enable **Blaze (pay-as-you-go) billing** — required for Cloud Functions outbound networking (SMTP)
7. Link project: `firebase use <YOUR_PROJECT_ID>` (or edit `.firebaserc`)
8. Add web app config as `VITE_FIREBASE_*` variables for production builds

### Firestore collections

- `contactSubmissions`
- `systemReviewSubmissions`
- `availabilitySlots`
- `callBookings`

All collections are **deny-all** for client SDK reads/writes (`firestore.rules`). Only Cloud Functions (Admin SDK) access data.

### Composite index

If availability queries fail, create a Firestore composite index for:

- Collection: `availabilitySlots`
- Fields: `status` Asc, `date` Asc, `time` Asc

Firebase Console will provide a direct link when the first query runs.

## Gmail SMTP setup

1. Enable 2FA on your Google account
2. Create an **App Password** at https://myaccount.google.com/apppasswords
3. Set `SMTP_USER` (your Gmail) and `SMTP_PASS` (app password, no spaces)
4. Set `SYSTEM_REVIEW_FROM_EMAIL` (e.g. `SKH.GLOBAL <you@gmail.com>`)
5. Set `SYSTEM_REVIEW_ADMIN_EMAIL` for internal notifications

## Firebase secrets (production)

Set each secret once via Firebase CLI (values are never stored in the repo):

```bash
firebase functions:secrets:set ADMIN_EMAIL
firebase functions:secrets:set SMTP_USER
firebase functions:secrets:set SMTP_PASS
firebase functions:secrets:set SYSTEM_REVIEW_FROM_EMAIL
firebase functions:secrets:set SYSTEM_REVIEW_ADMIN_EMAIL
```

Cloud Functions use **Application Default Credentials** for Firestore/Auth — you do not need `FIREBASE_PRIVATE_KEY` in production unless overriding the default service account.

Optional: set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` in `functions/.env` for local emulator use only.

List configured secrets: `firebase functions:secrets:access`

## Deploy

Prerequisites: Firebase CLI logged in (`firebase login`) and project linked.

```bash
npm run deploy
```

This builds the SPA, compiles Cloud Functions, and deploys hosting + functions + firestore rules.

Deploy subsets:

```bash
npm run deploy:hosting    # static site only (after npm run build)
npm run deploy:functions  # API only
firebase deploy --only firestore:rules
```

### Production build with client env

```bash
cp .env.production.example .env.production   # fill VITE_FIREBASE_* placeholders
npm run deploy
```

Verify Firebase config was embedded: search built JS in `dist/assets/` for your project ID placeholder. If missing, `VITE_FIREBASE_*` were not set during build.

## API routes

All routes are served by the `api` Cloud Function (Express app in `functions/src/`):

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/audit` | System review submission |
| POST | `/api/contact` | Contact form submission |
| GET | `/api/availability` | Public available slots |
| POST | `/api/book-slot` | Book a call slot |
| * | `/api/admin/*` | Protected admin APIs (Bearer token) |

## Security notes

- No secrets in the repository — use Firebase secrets and local `.env.local` (gitignored)
- Gemini API key is **not** bundled in the frontend
- Admin APIs require a valid Firebase ID token matching `ADMIN_EMAIL`
- Clients cannot read other clients' submissions (Firestore rules + server-only access)

## Legacy Netlify

The `netlify/` folder is deprecated. See `netlify/DEPRECATED.md`.
