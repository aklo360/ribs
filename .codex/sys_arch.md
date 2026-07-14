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
- Mailchimp Transactional, Resend, or an equivalent transactional sender for booking-email delivery
- Mailchimp Marketing API for newsletter signup

## Structure
- `app/page.tsx` — single-scroll home (nav → hero → tour → music → about → gallery → video → booking → footer)
- `app/book/page.tsx` — standalone booking page
- `app/api/book/route.ts` — edge route; validates with `lib/booking-schema.ts`, emails via Mailchimp Transactional when `MAILCHIMP_TRANSACTIONAL_API_KEY` or `MANDRILL_API_KEY` plus a verified `BOOKING_FROM_EMAIL` are configured, falls back to Resend when configured, returns HTTP 503 with the direct booking email when delivery is unconfigured, and exposes a non-secret `GET` health response for booking-email config state
- `app/api/newsletter/route.ts` — edge route; validates newsletter email signups and adds them to the configured Mailchimp audience
- `app/layout.tsx` — root layout, metadata, fonts, toaster, and the public Mailchimp connected-site script loaded from `SITE.mailchimpConnectedSiteScript`
- `components/site/*` — page sections; `components/booking/booking-form.tsx` — 4-step form. The live quote panel is intentionally hidden until the user reaches the Performance step and chooses a lineup, so the form does not open with the default public Duo estimate. Booked-date conflict warnings render as a full-width alert directly beneath the step progress bar on the Event step and must use `lib/tour.ts` as the same source of truth as the public tour list. The final form step only keeps the open-ended notes textarea; budget, travel/lodging, dress-requirement, and heard-about-us controls are intentionally not part of the visible booking flow.
- `components/site/smart-image.tsx` — image with branded gradient fallback
- `components/site/player-provider.tsx` — shared release-preview audio state used by the hero flip-card player, Music carousel player, and sticky footer player
- `lib/content.ts` — band data, bio, members, releases, socials, gallery, hero image, and public integration URLs such as the Mailchimp connected-site script
- `lib/booking-quote.ts` - shared booking estimate calculator used by the live form UI and booking email route; public-show minimums and maximums are editable there. Current booking set-length options are `≤ 2 hours`, `3 hours`, and `4 hours`, with 4 hours as the max; Original Music is informational for price and only caps effective length at `≤ 2 hours`. Longer set lengths raise both min and max: Public Event Duo anchors are `$500-$1,200`, `$750-$1,500`, and `$1,000-$2,000`. Fundraiser pricing uses the fundraiser base range with no extra discount. Sound selection is informational only and does not change quote ranges; legacy `Band provides PA / sound` and `Unsure` are accepted for stale browser tabs.
- `lib/tour.ts` - Bandsintown-derived tour list plus helpers (upcoming filter, date formatting). It remains the website source of truth; `scripts/tour-sync.mjs` can update it from Bandsintown through a reviewed PR workflow. The current launch list has 15 upcoming shows after adding the July 25, 2026 White Haven / Jam Below The Dam event, and each show carries a visible `priceLabel` (`Free` except the July 26 Mountain View show at `$20`).
- `scripts/tour-lib.mjs` and `scripts/tour-sync.mjs` - Node-based tour parser, normalizer, validator, diff, and writer. The live npm scripts load the source from environment-backed configuration: `BANDSINTOWN_APP_ID` uses the official Bandsintown for Artists endpoint for artist ID `15511983`; without that secret, the scripts fall back to the verified Bandsintown V3.1 all-events widget feed. Default sync mode merge-preserves existing shows that are missing from the incoming source; `--replace` is available only for deliberate full-source replacement.
- `scripts/notify-llphant-tg.mjs` - optional LLPhant Telegram alert sender for workflow PR/failure notifications. It reads bot/chat/thread values from GitHub Secrets and skips cleanly when they are absent.
- `.github/workflows/bandsintown-sync.yml` - daily/manual GitHub Actions listener. It fetches the verified Bandsintown V3.1 all-events widget feed by default, or `BANDSINTOWN_EVENTS_URL` when that override secret exists, validates updates, opens/updates an automated PR against `main`, and sends an LLPhant Telegram alert when a PR is created.
- `public/img/social/og-card.png` and `public/img/social/twitter-card.png` - static 1200x630 share-card images used by metadata, with the band logo, Syne tagline text, and Break Down cover art.
- `scripts/generate-og-card.mjs` - local-only headless Chrome renderer for regenerating the static share-card PNGs from the same logo, Break Down cover, and vendored Syne OFL font.

## Configuration
- Env (booking email): booking submissions are sent to `rootsinbluestone@gmail.com` from `SITE.bookingEmail`. The preferred sender is Mailchimp Transactional via `MAILCHIMP_TRANSACTIONAL_API_KEY` or `MANDRILL_API_KEY`, plus `BOOKING_FROM_EMAIL` from a verified sender/domain. `RESEND_API_KEY` remains a supported fallback. If no transactional sender is configured, `/api/book` returns HTTP 503 instead of pretending delivery succeeded. Mailchimp Marketing (`MAILCHIMP_API_KEY`) is only for newsletter audience signups and does not replace a Transactional/Mandrill key for contact-form notifications.
- Env (newsletter): `MAILCHIMP_API_KEY` and `MAILCHIMP_AUDIENCE_ID` are required for live signup delivery. `MAILCHIMP_SERVER_PREFIX` can override the data center derived from the API key suffix. `MAILCHIMP_SUBSCRIBE_STATUS` defaults to `pending` for double opt-in, and `MAILCHIMP_TAGS` defaults to `Website Signup`. The public Mailchimp connected-site loader is stored in `SITE.mailchimpConnectedSiteScript` and does not replace the custom newsletter UI.
- Env (share metadata): `NEXT_PUBLIC_SITE_URL` should be set at build time for direct Cloudflare uploads. Staging builds use `https://staging.roots-in-blue-stone.pages.dev`; production should use the approved production domain when production/DNS cutover is approved. `CF_PAGES_URL` is a fallback when available.
- GitHub Secrets (tour sync): `BANDSINTOWN_APP_ID` stores the official Bandsintown for Artists API key/app id. `BANDSINTOWN_EVENTS_URL` is optional and only overrides the default source. `BANDSINTOWN_AUTH_TOKEN` is optional for bearer-token sources. LLPhant Telegram PR alerts use `LLPHANT_TG_BOT_TOKEN` or `TELEGRAM_BOT_TOKEN_LLPHANT`, plus `LLPHANT_TG_CHAT_ID` and optional `LLPHANT_TG_THREAD_ID`.
- `wrangler.toml` — Cloudflare Pages target `roots-in-blue-stone`

## Deployment
- Cloudflare Pages project `roots-in-blue-stone`. Build via `@cloudflare/next-on-pages` (`npm run cf:build`), deploy via `wrangler pages deploy .vercel/output/static`.
- Staging/development preview (branch `staging`): https://staging.roots-in-blue-stone.pages.dev — LIVE.
- Production (branch `main`): https://roots-in-blue-stone.pages.dev — LIVE.
- Production direct uploads should be built with `NEXT_PUBLIC_SITE_URL=https://www.rootsinbluestone.com` so canonical/Open Graph metadata points at the approved launch domain.
- Custom domain/DNS cutover is not complete yet. The Cloudflare Pages project currently lists only `roots-in-blue-stone.pages.dev`; attach `www.rootsinbluestone.com` as a Pages custom domain before changing Wix DNS, then handle the apex/root domain through Cloudflare nameservers or an interim Wix redirect.
- Pages secrets needed for real emails/signups: `MAILCHIMP_TRANSACTIONAL_API_KEY` or `MANDRILL_API_KEY`, `BOOKING_FROM_EMAIL`, `MAILCHIMP_API_KEY`, and `MAILCHIMP_AUDIENCE_ID`. `RESEND_API_KEY` remains a supported booking-email fallback. Project compat: `nodejs_compat`.

## Media
- Public gallery assets live under `public/gallery/`. Walter's Drive photo set is optimized under `public/gallery/walter/`, and a curated 100-image selection from the downloaded RIBS photo zips is optimized under `public/gallery/zips/`. `lib/content.ts` owns a deduped and manually curated 66-photo gallery: Walter versions replace lower-quality repeated site photos, six unique site photos remain, and selected zip photos are hidden through `ZIP_GALLERY_EXCLUSIONS` without deleting source files. `components/site/gallery.tsx` renders that ordered list directly without randomizing on refresh. `ABOUT_IMAGE` in `lib/content.ts` pins the About section to `/gallery/g09.jpg` instead of depending on gallery order.
- Raw downloaded Drive staging files may exist locally under `refs/walter-drive/`, but that folder is ignored by Git; use the optimized public assets for the shipped site.
- Release artwork lives under `public/img/releases/`. `lib/content.ts` owns the release catalog; Santa Claus Is Coming To Town is intentionally excluded from the Music carousel. The favicon uses the Break Down cover art; static social cards use a black hero-style layout with the band logo, Syne-rendered `Groove, Grit & Good Vibes`, and the Break Down cover art on the right. The hero, Music section, and sticky footer all use the shared `PlayerProvider` audio state, so play/pause/progress stays synchronized across those surfaces.

## GitHub
- Remote: `git@github.com:aklo360/ribs.git` (private). Web: https://github.com/aklo360/ribs
- Default branch: `main`. Push as `aklo360`.
