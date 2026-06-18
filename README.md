# Roots in Blue Stone

Marketing + booking site for the band **Roots in Blue Stone** (RIBS). A redesign
of rootsinbluestone.com with an app-like, Spotify/dusk.fm-style feel.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- shadcn/ui (Base UI primitives, `base-nova` preset)
- react-hook-form + zod (booking form)
- motion (framer-motion) for animation
- Resend for booking-email delivery
- Deploy target: Cloudflare Pages

## Develop

```
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
```

## Content

All editable content lives in `lib/`:

- `lib/content.ts` — band info, bio, members, lineups, releases, socials, gallery, hero image
- `lib/tour.ts` — tour dates (⚠️ contains PLACEHOLDER upcoming shows — replace with real dates before launch)
- `lib/booking-schema.ts` — booking form fields + validation

## Booking form

`POST /api/book` validates with the shared zod schema and emails via Resend.
Without `RESEND_API_KEY` + `BOOKING_TO_EMAIL` it gracefully logs and returns
success, so local/dev and previews work unconfigured. See `.env.example`.

## Images

Band photos reference the current Wix CDN, which blocks server-side hotlinking
(403). `components/site/smart-image.tsx` falls back to branded gradient tiles
when an image fails. To make them permanent, drop real files in `public/` and
point `lib/content.ts` at them.

## Deploy (Cloudflare Pages — not yet run)

```
npm run cf:deploy    # confirm target/domain first
```

Set `RESEND_API_KEY`, `BOOKING_TO_EMAIL`, `BOOKING_FROM_EMAIL` as Pages secrets.
DNS cutover from the current Wix site is a separate, approval-gated step.
