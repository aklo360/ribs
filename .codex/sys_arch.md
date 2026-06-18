# System Architecture — Roots in Blue Stone (RIBS)

## Purpose
Public marketing + booking website for the band Roots in Blue Stone. Lets fans
find tour dates, hear the latest release, and lets talent buyers / private
clients submit a detailed booking inquiry. A redesign of the existing Wix site.

## Stack
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4; design system in `app/globals.css` (Bluestone Dark + glass utilities)
- shadcn/ui on Base UI primitives (`base-nova` preset) in `components/ui/`
- react-hook-form + zod (booking), motion (animation), lucide-react + custom brand SVGs
- Resend for booking-email delivery

## Structure
- `app/page.tsx` — single-scroll home (nav → hero → tour → music → about → gallery → video → booking → footer)
- `app/book/page.tsx` — standalone booking page
- `app/api/book/route.ts` — edge route; validates with `lib/booking-schema.ts`, emails via Resend, graceful no-op when unconfigured
- `components/site/*` — page sections; `components/booking/booking-form.tsx` — 5-step form
- `components/site/smart-image.tsx` — image with branded gradient fallback
- `lib/content.ts` — band data, bio, members, releases, socials, gallery, hero image
- `lib/tour.ts` — tour dates + helpers (upcoming filter, date formatting); has PLACEHOLDER shows

## Configuration
- Env (booking email): `RESEND_API_KEY`, `BOOKING_TO_EMAIL`, `BOOKING_FROM_EMAIL` (see `.env.example`)
- `wrangler.toml` — Cloudflare Pages target `roots-in-blue-stone`

## Deployment
- Target: Cloudflare Pages via `npm run cf:deploy` (@cloudflare/next-on-pages). NOT yet run.
- DNS cutover from the current Wix site is a separate, approval-gated step.

## GitHub
- Remote: none yet (local git only). When created, push as `aklo360`.
- Default branch: `main`.
