# RIBS Production Launch Checklist

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan follows `~/.codex/PLANS.md`.

## Purpose / Big Picture

Roots in Blue Stone needs a production-ready website launch that Walter can trust for tour dates, booking quote estimates, booking-email delivery, photos, and basic merch direction. After this plan is complete, AKLO and Walter can test the quote form end to end, approve the final site, deploy to the production Cloudflare Pages target, and cut DNS over from Wix only after an explicit approval checkpoint.

## Progress

- [x] (2026-07-08) Read project context and current launch state.
- [x] (2026-07-08) Restore deterministic reverse-chronological gallery ordering and dedupe rendered gallery photos.
- [x] (2026-07-08) Fix mobile hamburger menu logo aspect ratio.
- [x] (2026-07-08) Replace stale static tour dates with current Bandsintown/Shazam-derived launch dates.
- [x] (2026-07-08) Remove Trio from the public "Available as" display.
- [x] (2026-07-08) Lower public-show quote minimums in `lib/booking-quote.ts` per Walter's local bar/restaurant note.
- [x] (2026-07-08) Run local `npm run lint` and `npm run build` after the Walter launch notes pass.
- [ ] Decide whether public minimums should apply only to Bar / Restaurant or also Winery / Brewery and Other public bookings.
- [ ] Decide the wedding quote path: full form, lighter inquiry path, downloadable package PDF, or a combination.
- [x] (2026-07-20) Add the reviewed three-product merch catalog with local mockups and direct product links.
- [x] (2026-07-20) Create and verify the public `ribs.printful.me` Quick Store with hosted customer checkout.
- [x] (2026-07-20) Match website prices to the live catalog and update only the replacement T-shirt mockup and URL.
- [ ] Remove the old Wix-connected Printful store only after Walter confirms it is no longer needed for historical orders or product templates.
- [ ] Enable Mailchimp Transactional/Mandrill, configure production booking email secrets in Cloudflare Pages without printing secret values, and verify `BOOKING_FROM_EMAIL`.
- [ ] Send test booking submissions from staging and confirm Walter sees the exact email format he wants.
- [ ] Run final lint, build, and browser checks on staging.
- [ ] Design a post-launch Bandsintown sync/listener for Roots in Blue Stone artist ID `15511983` so new shows can update the website automatically instead of relying on manual `lib/tour.ts` edits.
- [ ] Get explicit AKLO approval for production deploy target and DNS cutover.
- [ ] Deploy production and verify the live production URL.
- [ ] Cut DNS from Wix only after production verification and approval.

## Surprises & Discoveries

- Observation: Walter's stale-date report is real, but the cause is not a broken live pull. The site stores a static tour list in `lib/tour.ts`.
  Evidence: `lib/tour.ts` exports `SHOWS` directly and the home tour section reads from that local module.
- Observation: The unauthenticated Bandsintown REST API is not currently usable as a simple server pull.
  Evidence: API requests returned an authorization error. The public artist page also presented a Cloudflare block from the shell request, so a durable integration needs either an official widget, authorized API path, or manual/CMS workflow.

## Decision Log

- Decision: Keep `lib/tour.ts` as the launch source of truth for now and document it as static.
  Rationale: This avoids pretending the site is live-syncing Bandsintown while still letting launch proceed with corrected dates.
  Date/Author: 2026-07-08 / LLPhant.
- Decision: Apply Walter's lowered minimums only to the existing public-show quote bucket.
  Rationale: The current quote calculator groups Bar / Restaurant, Winery / Brewery, Other, and unspecified public events into one bucket. Splitting Bar / Restaurant only should be a deliberate follow-up decision because it changes quote behavior by event type.
  Date/Author: 2026-07-08 / LLPhant.
- Decision: Do not production deploy or DNS cut over from this plan without explicit approval in the current conversation.
  Rationale: Project rules require confirmation before production deploy or DNS changes.
  Date/Author: 2026-07-08 / LLPhant.

## Outcomes & Retrospective

The July 8 pass corrected visible launch blockers in code and captured the remaining decisions. Production launch is still blocked on Walter/AKLO choices for wedding quoting, Printful scope, booking-email secret configuration, and final quote-email testing.

## Context and Orientation

The RIBS site is a Next.js 16 and React 19 app deployed on Cloudflare Pages. Most editable band content lives in `lib/content.ts`. Tour dates live in `lib/tour.ts`. Booking form questions live in `lib/booking-schema.ts` and `components/booking/booking-form.tsx`. Quote estimate math lives in `lib/booking-quote.ts`. Booking emails are sent by `app/api/book/route.ts` to `sup@rootsinbluestone.com` through Resend when `RESEND_API_KEY` plus verified `BOOKING_FROM_EMAIL` are configured; Mailchimp Transactional remains an optional fallback.

The production deploy target is Cloudflare Pages project `roots-in-blue-stone`. Staging is currently the safe review target. Production deploy and DNS cutover are approval-gated.

## Plan of Work

First, finish content correctness: tour dates, lineup labels, gallery order, photos, and quote minimums. Next, resolve booking business rules that cannot be guessed safely, especially weddings and whether local public pricing should be restricted to Bar / Restaurant only. Then configure booking email delivery in Cloudflare Pages and test real submissions on staging. After Walter approves the email format and quote behavior, run final lint, build, browser checks, and a staging smoke test. Finally, after explicit approval, deploy production and cut DNS from Wix with a rollback path ready.

## Concrete Steps

Work from `/Users/llphant/projects/ribs`.

Run static verification:

    npm run lint
    npm run build

Run staging deploy only after confirming the target:

    npm run cf:deploy -- --branch staging

Before production, confirm secrets exist without printing values. Use redacted checks only. Then deploy only after explicit approval:

    npm run cf:deploy

## Validation and Acceptance

Acceptance for launch requires these observable checks:

- Home page shows corrected upcoming tour dates in chronological order.
- About "Available as" reads Duo, 4 Piece, 5 Piece, 7 Piece, with no Trio.
- Gallery opens with the approved reverse-chronological order and no obvious repeated photos.
- Mobile hamburger menu logo keeps its natural aspect ratio.
- Booking form shows a live estimate, caps Original Music at 2 hours, asks outdoor shade/power only for outdoor settings, and includes the estimate in the email.
- Walter receives at least one staging booking-email test and confirms the format is useful.
- Production URL loads after deploy, and the old Wix site can be restored or DNS reverted if a launch-blocking issue appears.

## Idempotence and Recovery

Most content edits are safe to repeat because they are static files under Git. Before deployment, inspect `git status` and keep the last known-good Cloudflare deployment available as the rollback target. If DNS cutover causes a launch issue, revert DNS to Wix or roll Cloudflare Pages back to the previous successful deployment.

## Artifacts and Notes

The remaining non-code launch decisions are:

- Wedding packages: likely a downloadable document plus a lighter inquiry path so wedding clients are not deterred before they know every detail.
- Printful: the reviewed public catalog and mockups are now on-site. The remaining migration is replacement manual/API store creation, product-template publishing, a `sync_products/read` token, customer checkout/payment, and final removal of the old Wix-connected store.
- Bandsintown: current site uses a static list; a future live solution should watch the Roots in Blue Stone Bandsintown artist page / artist ID `15511983`, detect new shows, and update the website through an official API path, scrape-safe watcher, webhook-like polling job, or owner-review workflow. Do not silently publish external event data without a review/rollback path.

## Interfaces and Dependencies

The launch depends on Cloudflare Pages, Next.js, Mailchimp Transactional or another transactional sender, static local images under `public/`, and the editable TypeScript data modules under `lib/`. Do not introduce a second source of truth for band content unless the project intentionally adds a CMS or live Bandsintown integration.
