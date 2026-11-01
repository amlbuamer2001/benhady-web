# Bin Hadi – Car Rental (Next.js)

Next.js (App Router) · TypeScript strict · Tailwind v4 · next-intl (ar/en) · React Hook Form + Zod · TanStack Query · Axios · Motion

## Run
```bash
npm install
cp .env.example .env.local      # set API_BASE_URL
# put the brand font in public/fonts/alfont_com_29LT-Kaff-Medium.ttf
npm run dev
```

## Architecture
- `src/app/[locale]/(auth)/*` – server pages (SEO metadata, noindex) that render small client forms.
- `src/app/api/{auth,profile,phone-tokens}` – BFF route handlers built on `src/lib/api/bff.ts`: they proxy to the backend, keep the token in an **httpOnly cookie** (never exposed to JS), send multipart where the API docs require it, and clear the session when the backend answers 401.
- `src/features/auth` – components, hooks (TanStack mutations), services (Axios -> `/api/auth/*`), Zod schemas, types.
- `src/lib/api/server.ts` – `serverFetch` (native fetch + Next caching) for Server Component data (cars, content).
- `src/components/ui` – shared primitives (Button, fields, OTP, segmented control, stepper...).
- `messages/{ar,en}.json` – all copy; validation messages are translation keys.

## Open items to confirm with backend
1. Password-reset OTP request uses `auth/resend-phone-otp` (`authService.requestPasswordResetOtp`).
2. Visitor has `license_number` (step 2) **and** `driving_license_number` (step 4).
3. The resend-OTP doc example sends a 9-digit phone (`571864820`); we send `966XXXXXXXXX` like verify-phone.
4. Contact email in `src/config/site.ts` is a guess (`info@ebinhadi.com`).
5. Profile endpoints (`profile`, `profile/update`, ...) are not in the docs yet (`features/profile/services/profile.service.ts`).
6. FCM: `phoneTokenService` is ready but needs a Firebase web config to obtain the device token.

## Replace with Figma exports
`public/images/logo.svg` (placeholder), footer social icons (`siteConfig.social`), UI icons in `components/icons`, Saudi flag.
