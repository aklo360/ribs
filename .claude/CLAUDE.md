# Roots in Blue Stone (RIBS)

Band marketing + booking website — client web project for AKLO. A redesign of
rootsinbluestone.com with a Spotify/dusk.fm app-like feel.

## Stack
- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- shadcn/ui (Base UI primitives, `base-nova` preset) — first AKLO shadcn project
- react-hook-form + zod, motion, Resend; Cloudflare Pages target

## Current Intent
Single-page site (+ `/book` route) prioritizing tour dates, latest release, and
a detailed booking-inquiry form. Design system is **Bluestone Dark** (deep
slate-indigo + frosted glass + warm amber). All band content is data-driven in
`lib/content.ts` and `lib/tour.ts`.

## Notes
- `lib/tour.ts` owns the Bandsintown-derived tour list and visible ticket price labels. The reviewed sync automation in `scripts/tour-sync.mjs` and `.github/workflows/bandsintown-sync.yml` uses `BANDSINTOWN_APP_ID` for the official Bandsintown for Artists API when configured, otherwise falls back to the verified Bandsintown V3.1 all-events widget feed; `BANDSINTOWN_EVENTS_URL` is only an override.
- Booking form emails via Resend to `rootsinbluestone@gmail.com`; needs `RESEND_API_KEY` and a verified `BOOKING_FROM_EMAIL`, and degrades gracefully without either setting. Never commit secrets.
- Newsletter signup uses the server-side Mailchimp route at `app/api/newsletter/route.ts`; configure `MAILCHIMP_API_KEY` and `MAILCHIMP_AUDIENCE_ID` as Cloudflare Pages secrets, with optional `MAILCHIMP_SERVER_PREFIX`, `MAILCHIMP_SUBSCRIBE_STATUS`, and `MAILCHIMP_TAGS`. `SITE.mailchimpConnectedSiteScript` loads the public Mailchimp connected-site script without replacing the custom UI.
- Images use `SmartImage` fallback (Wix CDN blocks hotlinking); prefer real assets in `public/`.
- No production deploy or DNS cutover without explicit approval. Push as `aklo360`.

Do not route RIBS work through other projects.
