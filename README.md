# Roots in Blue Stone

Marketing + booking site for the band **Roots in Blue Stone** (RIBS). A redesign
of rootsinbluestone.com with an app-like, Spotify/dusk.fm-style feel.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- shadcn/ui (Base UI primitives, `base-nova` preset)
- react-hook-form + zod (booking form)
- motion (framer-motion) for animation
- Mailchimp Transactional or Resend for booking-email delivery
- Mailchimp Marketing API for newsletter signup
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
- `lib/tour.ts` — tour dates, updated manually or by the Bandsintown sync workflow
- `lib/booking-schema.ts` — booking form fields + validation

## Tour sync

The scheduled `.github/workflows/bandsintown-sync.yml` workflow pulls the full
upcoming Bandsintown event feed, validates it, updates `lib/tour.ts`, opens a
pull request, and alerts LLPhant on Telegram. If `BANDSINTOWN_APP_ID` is set,
the sync uses the official artist API endpoint for artist ID `15511983`; without
that secret it falls back to the verified public widget feed.

Optional GitHub secrets:

- `BANDSINTOWN_EVENTS_URL` to override the default all-events endpoint
- `BANDSINTOWN_APP_ID` for the official Bandsintown for Artists API key
- `BANDSINTOWN_AUTH_TOKEN`
- `LLPHANT_TG_BOT_TOKEN` or `TELEGRAM_BOT_TOKEN_LLPHANT`
- `LLPHANT_TG_CHAT_ID`
- `LLPHANT_TG_THREAD_ID`

Local checks:

```
npm run tour:validate
npm run tour:sync
node scripts/tour-sync.mjs --source-file scripts/fixtures/bandsintown-events.sample.json
```

## Booking form

`POST /api/book` validates with the shared zod schema and emails
`rootsinbluestone@gmail.com`. It prefers Mailchimp Transactional when
`MAILCHIMP_TRANSACTIONAL_API_KEY` or `MANDRILL_API_KEY` is configured, and falls
back to Resend when `RESEND_API_KEY` is configured. Mailchimp Transactional also
requires `BOOKING_FROM_EMAIL` to be a verified sender/domain. Without a
transactional sender, the route returns a visible 503 fallback message instead
of pretending the inquiry was delivered.

## Newsletter

`POST /api/newsletter` adds signup emails to the configured Mailchimp audience.
Keep the Mailchimp API key server-side only; do not use `NEXT_PUBLIC_*` for
newsletter credentials.

The root layout also loads the public Mailchimp connected-site script from
`SITE.mailchimpConnectedSiteScript`, using `next/script`. That lets Mailchimp
recognize the site while the visible newsletter form remains fully custom.

Required Cloudflare Pages secrets:

- `MAILCHIMP_API_KEY`
- `MAILCHIMP_AUDIENCE_ID`

Optional Cloudflare Pages variables:

- `MAILCHIMP_SERVER_PREFIX` if the data center should not be derived from the API key suffix
- `MAILCHIMP_SUBSCRIBE_STATUS`, default `pending` for double opt-in
- `MAILCHIMP_TAGS`, default `Website Signup`

## Images

Band photos reference the current Wix CDN, which blocks server-side hotlinking
(403). `components/site/smart-image.tsx` falls back to branded gradient tiles
when an image fails. To make them permanent, drop real files in `public/` and
point `lib/content.ts` at them.

## Deploy (Cloudflare Pages — not yet run)

```
npm run cf:deploy    # confirm target/domain first
```

Set `BOOKING_FROM_EMAIL`, `MAILCHIMP_TRANSACTIONAL_API_KEY` or
`MANDRILL_API_KEY`, `MAILCHIMP_API_KEY`, and `MAILCHIMP_AUDIENCE_ID` as Pages
secrets. `RESEND_API_KEY` is still supported as a booking-email fallback.
DNS cutover from the current Wix site is a separate, approval-gated step.
