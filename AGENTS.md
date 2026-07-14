<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Repository Guidelines

Roots in Blue Stone (RIBS) — band marketing + booking site. Client web project
for AKLO. Next.js 16 + React 19 + Tailwind v4 + shadcn/ui, deploying to
Cloudflare Pages.

## Project Structure
- `app/`: App Router pages (`page.tsx` home, `book/` booking page, `api/book/` booking email route) and `globals.css` (Bluestone Dark design system).
- `components/site/`: page sections (nav, hero, tour, music, about, gallery, video, footer).
- `components/booking/`: multi-step booking form.
- `components/ui/`: shadcn/ui (Base UI) primitives.
- `lib/`: editable content (`content.ts`, `tour.ts`), quote logic, and `booking-schema.ts`.
- `.codex/` and `.claude/`: local project context. Do not duplicate global rules here.

## Commands
- `npm run dev`: local dev at http://localhost:3000.
- `npm run build` / `npm run lint`: production build + lint.
- `npm run cf:deploy`: Cloudflare Pages deploy — confirm target/domain first.

## Working Rules
- Design language is **Bluestone Dark**: deep slate-indigo base, frosted glass (`.glass` / `.glass-raised`), warm amber (`--primary` `#e0a84f`) accents, dark-first. Keep it app-like (Spotify/dusk.fm feel).
- All band content is data-driven in `lib/`. Edit data there, not in components.
- `lib/tour.ts` owns the Bandsintown-derived tour list. The reviewed sync automation in `scripts/tour-sync.mjs` and `.github/workflows/bandsintown-sync.yml` uses the verified Bandsintown V3.1 all-events widget feed by default and opens a PR when it detects changes; `BANDSINTOWN_EVENTS_URL` is only an override.
- Booking emails send to `rootsinbluestone@gmail.com` from `SITE.bookingEmail`; delivery prefers Mailchimp Transactional with `MAILCHIMP_TRANSACTIONAL_API_KEY` or `MANDRILL_API_KEY` plus a verified `BOOKING_FROM_EMAIL`, and can fall back to Resend with `RESEND_API_KEY`. The form returns a visible 503 fallback message when no sender is configured. Never commit secrets.
- Newsletter signups post to `app/api/newsletter/route.ts` and require Mailchimp Pages secrets: `MAILCHIMP_API_KEY` and `MAILCHIMP_AUDIENCE_ID`; optional tuning vars are `MAILCHIMP_SERVER_PREFIX`, `MAILCHIMP_SUBSCRIBE_STATUS`, and `MAILCHIMP_TAGS`. `SITE.mailchimpConnectedSiteScript` loads Mailchimp's public connected-site script, but the visible signup UI must stay custom. Never expose Mailchimp API keys through `NEXT_PUBLIC_*`.
- Images use `SmartImage` with a branded fallback; Wix CDN blocks hotlinking, so prefer dropping real assets into `public/`.
- Do not run a production deploy or DNS cutover without explicit approval. Push as `aklo360`.
