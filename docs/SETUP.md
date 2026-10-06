# ClubSphere – going live checklist

The app runs in **demo mode** (hard-coded data) until the two Supabase variables exist. Do these in order.

## 1. Supabase (Batch 6)
1. Create a project → **SQL Editor** → run `supabase/schema.sql` top to bottom (it is written to be re-runnable block by block).
2. **Authentication → Providers**: enable Email (OTP) and Phone.
3. **Authentication → Email Templates → Magic Link / Confirm signup**: include `{{ .Token }}` so users get a 6-digit code, not only a link.
4. Vercel → Settings → Environment Variables (all environments):
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` – **server only, never prefix with `VITE_`**
5. Sign in once, then make yourself the first admin (SQL Editor):
   `update public.profiles set role='techAdmin' where email='you@example.com';`
6. As Tech Admin: add a University → create Clubs → assign each club an admin (All Clubs page).

## 2. Email OTP through Resend (Batch 7a)
No code needed – Supabase sends the mail, Resend delivers it.
1. Resend → verify your sending domain (SPF + DKIM), create an API key.
2. Supabase → **Authentication → Emails → SMTP Settings** → enable custom SMTP:
   host `smtp.resend.com`, port `465`, username `resend`, password = the API key, sender e.g. `login@yourdomain.com`.
3. Raise the email rate limit (Authentication → Rate Limits); the built-in limit is very low once you use custom SMTP.

## 3. SMS OTP (Batch 7b) – pick ONE
**Option A – Twilio (no code):** Supabase → Authentication → Providers → Phone → Twilio (Account SID, Auth Token, Messaging Service SID).

**Option B – MSG91 (India, DLT-compliant), included in this repo:**
1. MSG91: complete DLT registration, create an **OTP template** (note its Template ID), create an Auth Key.
2. **Turn OFF IP security for the Auth Key** (or whitelist) – Vercel functions have no fixed IP, otherwise MSG91 answers `200` with `type: error`.
3. Vercel env: `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID`.
4. Supabase → **Authentication → Hooks → Send SMS** → HTTPS → `https://<your-domain>/api/sms-hook` → generate secret → put it in Vercel as `SEND_SMS_HOOK_SECRET` (keeps the `v1,whsec_…` form). Redeploy.
5. Phone provider must be enabled in Supabase, otherwise the hook is never called.

## 4. Razorpay payments (Batch 8)
1. Razorpay dashboard → API keys (start in **Test mode**) → Vercel env `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.
2. Webhooks → add `https://<your-domain>/api/razorpay-webhook`, events `payment.captured` and `payment.failed`, choose a secret → `RAZORPAY_WEBHOOK_SECRET`.
3. Flow: browser → `/api/razorpay-order` (price read from the DB) → Razorpay checkout → `/api/razorpay-verify` (signature check) → registration confirmed. The webhook is a backup if the browser closes.
4. Paid registrations can **only** be created by the server (RLS blocks client inserts for paid events).
5. Refunds are not automated yet – issue them from the Razorpay dashboard.
6. Before switching to live keys: test a full payment, a failed payment, and closing the checkout window.

## 5. Web push (Batch 9)
1. `npx web-push generate-vapid-keys`
2. Vercel env: `VITE_VAPID_PUBLIC_KEY` (public), `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (an email), `PUSH_WEBHOOK_SECRET` (any long random string).
3. Supabase → **Database → Webhooks → Create**: table `notifications`, event `Insert`, type *HTTP Request*, `POST https://<your-domain>/api/push-send`, add header `x-webhook-secret: <PUSH_WEBHOOK_SECRET>`. (Database webhooks are not signed, so this header is the protection.)
4. Users turn push on from the bell panel. iPhone/iPad only deliver web push after **Add to Home Screen** (iOS 16.4+).

## 6. Smoke test after deploy
- Email OTP login → profile saves → follow a club → register for a free event → ticket shows a QR.
- Club admin: create event (goes to faculty) → faculty approves → followers get a notification.
- Club admin: **Scan Tickets** on a phone → student's QR → "Checked in ✓"; scanning again → "Already checked in".
- Paid event: test-mode payment → ticket becomes active.
- Tech Admin → Settings → maintenance mode on → another browser sees the maintenance page; admin can still sign in.

## Known limits
- Faculty are not yet restricted to their own university when editing (only their pending-approval list is filtered).
- Analytics aggregate in the browser (fine for thousands of rows, move to SQL views beyond that).
- Event reminders / "spots filling up" notifications need a scheduler (Supabase cron) – not built.
