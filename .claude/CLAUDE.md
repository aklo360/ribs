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
- `lib/tour.ts` has PLACEHOLDER upcoming shows — replace before launch.
- Booking form emails via Resend; needs `RESEND_API_KEY` + `BOOKING_TO_EMAIL`, degrades gracefully without them. Never commit secrets.
- Images use `SmartImage` fallback (Wix CDN blocks hotlinking); prefer real assets in `public/`.
- No production deploy or DNS cutover without explicit approval. Push as `aklo360`.

Do not route RIBS work through other projects.
