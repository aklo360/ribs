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
- `components/site/player-provider.tsx` — shared latest-release preview audio state used by the hero flip-card player and sticky footer player
- `lib/content.ts` — band data, bio, members, releases, socials, gallery, hero image
- `lib/booking-quote.ts` — shared booking estimate calculator used by the live form UI and booking email route
- `lib/tour.ts` — tour dates + helpers (upcoming filter, date formatting); has PLACEHOLDER shows

## Configuration
- Env (booking email): `RESEND_API_KEY`, `BOOKING_TO_EMAIL`, `BOOKING_FROM_EMAIL` (see `.env.example`)
- `wrangler.toml` — Cloudflare Pages target `roots-in-blue-stone`

## Deployment
- Cloudflare Pages project `roots-in-blue-stone`. Build via `@cloudflare/next-on-pages` (`npm run cf:build`), deploy via `wrangler pages deploy .vercel/output/static`.
- Staging (branch `staging`): https://staging.roots-in-blue-stone.pages.dev — LIVE.
- Production (`main` branch → roots-in-blue-stone.pages.dev) and DNS cutover from Wix: approval-gated, not yet run.
- Pages secrets needed for real emails: `RESEND_API_KEY`, `BOOKING_TO_EMAIL`, `BOOKING_FROM_EMAIL`. Project compat: `nodejs_compat`.

## Media
- Public gallery assets live under `public/gallery/`. Walter's Drive photo set is optimized under `public/gallery/walter/`, and a curated 100-image selection from the downloaded RIBS photo zips is optimized under `public/gallery/zips/`; both are appended to the carousel through `lib/content.ts`.
- Raw downloaded Drive staging files may exist locally under `refs/walter-drive/`, but that folder is ignored by Git; use the optimized public assets for the shipped site.
- Release artwork lives under `public/img/releases/`. `lib/content.ts` owns the release catalog; the hero uses the featured release in a flip-card player backed by the shared `PlayerProvider`, and `components/site/music.tsx` renders the single-column all-release carousel with preview players and per-release service buttons.

## GitHub
- Remote: `git@github.com:aklo360/ribs.git` (private). Web: https://github.com/aklo360/ribs
- Default branch: `main`. Push as `aklo360`.
