# Changelog — Roots in Blue Stone (RIBS)

## 2026-07-20 — Production domain and Resend launch wiring

- Made `https://rootsinbluestone.com` the canonical production URL for site metadata and social cards.
- Added permanent host redirects from `www.rootsinbluestone.com`, `ribs.music`, and `www.ribs.music` to the apex domain while preserving paths and query strings.
- Made Resend the preferred booking-email provider and required both `RESEND_API_KEY` and a verified `BOOKING_FROM_EMAIL` before the API reports delivery as configured. Mailchimp Transactional remains an optional fallback.
- Configured the production Pages sender as `sup@rootsinbluestone.com`; the booking destination remains `rootsinbluestone@gmail.com`, with the client's email used as `Reply-To`.
- Confirmed Cloudflare DNS contains Mailchimp DKIM, Resend DKIM/SPF, DMARC, and Email Routing MX/SPF records without exposing credential values.
- Confirmed newsletter API signups default to `pending` for Mailchimp double opt-in.
- Verified the Next.js host redirects locally, including path/query preservation; `npm run lint`, `npm run build`, and `npm run cf:build` passed.
- Deployed production commit `da35321` to Cloudflare Pages, attached all four custom hostnames, replaced only the legacy Wix/Namecheap web records, and preserved all mail-related DNS records.
- Purged both Cloudflare zone caches after cutover so stale Wix responses no longer remain. Cloudflare reports all four custom domains active; the apex returns HTTP 200 and the other three return HTTP 308 to the apex with paths and queries preserved.
- Verified the live booking health endpoint reports Resend and the verified sender configured, without sending an external test email. Live canonical, Open Graph, Twitter image, and invalid-newsletter validation checks passed.
- Visually verified the official domain in headless Chrome at desktop and an emulated 390x844 mobile viewport. The mobile document has no horizontal overflow, and hero controls remain within the viewport.

## 2026-07-14 — Booking email delivery guard and quote corrections

- Confirmed the production Cloudflare Pages project only has the Mailchimp newsletter secrets configured; `RESEND_API_KEY` is missing, so booking submissions could be accepted by the form without actual email delivery.
- Updated `app/api/book/route.ts` so missing booking-email configuration returns HTTP 503 with the direct booking email instead of a fake success.
- Added a lightweight `GET /api/book` health response that reports whether booking email delivery is configured, without exposing any secret values.
- Updated the booking form client to display the API's real error message and direct users to `rootsinbluestone@gmail.com` if booking email delivery is not connected.
- Added Mailchimp Transactional support for booking emails through `MAILCHIMP_TRANSACTIONAL_API_KEY` or `MANDRILL_API_KEY`, with `RESEND_API_KEY` preserved as a fallback. The current Mailchimp Marketing key used for newsletter signups is not a Transactional/Mandrill key.
- Required both City and State / Region on the booking event step.
- Moved the yellow booked-date warning out of the Event Date field and into a full-width alert directly beneath the step progress bar on the Event step, using normal sentence case: `*Potential conflict, band is booked on this date but will accommodate if possible.`
- Hid the live quote estimate until the client reaches the Performance step and selects a lineup size, so the form no longer opens with a misleading default public Duo estimate. The booked-date warning remains separate from the quote panel so clients see it immediately after choosing a conflicting date.
- Documented that booking date-conflict checks must use `lib/tour.ts` as the same source of truth as the website tour list, so future Bandsintown listener updates automatically feed the booking form without a second direct Bandsintown lookup.
- Removed the booking quote note `Travel may adjust the final quote.` from the shared quote calculator.
- Consolidated booking event-type buttons to `Public Event`, `Private / Corporate Event`, `Wedding`, `Fundraiser`, and `Other`, while keeping server-side compatibility for old event labels from stale browser tabs.
- Kept Fundraiser pricing on the normal fundraiser base range with no extra discount.
- Updated `Not sure — recommend one` lineup estimates to show the full scenario range from Duo through 7-Piece instead of falling back to Duo pricing.
- Changed the two-hour set-length option label to `≤ 2 hours`, kept legacy `2 hours` submissions valid, and made repertoire informational for pricing. `Original Music` now only caps the effective set length at `≤ 2 hours`.
- Replaced the freeform custom-hours input with a fixed `4 hours` option, making 4 hours the maximum selectable set length. Legacy `customHours` submissions now validate only when the value is exactly 4.
- Updated duration pricing so longer set lengths can raise both the lower and upper estimate. Public Event Duo now shows `$500-$1,200` at `≤ 2 hours`, `$750-$1,500` at `3 hours`, and `$1,000-$2,000` at `4 hours`; the same multipliers apply across the other lineup/event buckets.
- Simplified the booking form sound question to `Will the band be providing sound?`, renamed the visible band-supplied option to `Band provides sound`, and replaced the visible `Unsure` sound option with `Mix of Both`. Sound selection is informational and does not change the quote estimate. Legacy `Band provides PA / sound` and `Unsure` submissions remain valid for stale browser tabs.
- Hid the `Backline / gear available on site` selector unless the sound answer is `Venue provides sound` or `Mix of Both`, added `Partial PA / Sound System` next to `Full PA / Sound System`, and cleared hidden gear selections when clients switch to `Band provides sound`.
- Renamed the final booking form action button to `SUBMIT`.
- Collapsed the booking flow from 5 displayed steps to 4 by moving final notes onto the final sound/details screen, so the progress bar is full on `Step 4 of 4` before submitting.
- Replaced the swapping Step 3 `Continue` / Step 4 submit controls with one stable `type="button"` primary action. Native form-submit events can only advance earlier steps, and `/api/book` is called exclusively by an explicit click while already on Step 4, preventing the Step 3-to-4 transition from triggering the unconfigured-email error.
- Removed the visible Budget Range, Travel & Lodging, Formal / Upscale Dress Requirement, and How Did You Hear About Us fields from the booking form. The booking schema, quote calculator, and booking email output no longer use those fields.
- Expanded repository secret-file protection to ignore `.dev.vars` and `*.key` alongside the existing `.env*` and `*.pem` patterns.
- Verification: Cloudflare Pages secret-name audit, local no-sender POST returned HTTP 503 with the direct-email message, direct quote/schema probes confirmed duration-based max increases, no fundraiser discount, `4 hours` pricing, sound selection does not affect quote ranges, required State / Region, and rejection of `customHours: 5`, `npm run lint`, and `npm run build` passed.
- Superseded on 2026-07-20: Resend and the verified booking sender are now configured; Mailchimp Marketing remains dedicated to newsletter audience signups.

## 2026-07-13 — Tip jar paused before launch

- Removed the virtual tip jar from the live site for now.
- Removed the tip-jar nav item, homepage tip-jar band, hero CTA, booking-section chip, and footer CTA.
- Deleted the now-unused tip-jar components so the Venmo link is not shipped in the app bundle.
- Built and deployed the tip-jar-free site separately to Cloudflare Pages `staging` and `main`, preserving staging for development and production for launch.
- Verified both live aliases return HTTP 200, both newsletter API routes still validate through `/api/newsletter`, and no tip-jar/Venmo strings remain in live production, live staging, or the generated Cloudflare output.
- Production custom domain/DNS cutover is still pending; the Pages project currently exposes the production build at `https://roots-in-blue-stone.pages.dev`.

## 2026-07-13 — Wix contact export audit

- Audited the Wix contacts export at `/Users/llphant/Downloads/contacts.csv` against the Roots In Blue Stone Mailchimp audience.
- The export had 213 rows, 42 valid unique email addresses, and 31 contacts marked `Subscribed`.
- Skipped the 9 `Never subscribed` contacts and 2 `Unsubscribed` contacts.
- All 31 subscribed Wix contacts were already present in Mailchimp, so no new contacts were added and no duplicate contacts were imported.

## 2026-07-13 — Mailchimp newsletter integration

- Replaced the optimistic public Mailchimp embedded-form submission with a server-side `POST /api/newsletter` route.
- The newsletter route adds subscribers to the configured Mailchimp audience with the API key kept in server-side Cloudflare Pages secrets.
- Updated the homepage newsletter form to call the local API route, show real error states, handle already-subscribed contacts, and show double-opt-in confirmation copy when Mailchimp returns `pending`.
- Added a hidden honeypot field for basic bot filtering.
- Added the previous site's public Mailchimp connected-site loader through `next/script` so Mailchimp can recognize the new site without replacing the custom RIBS newsletter UI.
- Documented the required Mailchimp Pages secrets: `MAILCHIMP_API_KEY` and `MAILCHIMP_AUDIENCE_ID`, plus optional `MAILCHIMP_SERVER_PREFIX`, `MAILCHIMP_SUBSCRIBE_STATUS`, and `MAILCHIMP_TAGS`.
- Configured the Cloudflare Pages production secrets `MAILCHIMP_API_KEY` and `MAILCHIMP_AUDIENCE_ID` for the `roots-in-blue-stone` project, using the Roots In Blue Stone Mailchimp audience. Secret values were not printed or committed.

## 2026-07-12 — Virtual tip jar

- Added a site-wide virtual tip jar using the public Venmo destination currently exposed through the band's Linktree: `https://www.venmo.com/u/waltanamo`.
- Centralized the payment destination in `SITE.tipJar` so the label, service, handle, or URL can be changed from `lib/content.ts`.
- Added a homepage tip-jar band after tour dates, plus compact CTAs in the hero, booking contact chips, footer, and navigation.

## 2026-07-10 — Booking email destination fix

- Changed the public booking/contact email to `rootsinbluestone@gmail.com`.
- Updated the booking section and footer contact links through `SITE.bookingEmail`.
- Updated the booking API route so form submissions send to `rootsinbluestone@gmail.com` directly, instead of relying on an environment variable that could still point at an old address.
- Removed stale recipient setup references from project docs and local context.

## 2026-07-10 — Tour price labels and official Bandsintown API support

- Added a `priceLabel` field to `lib/tour.ts` and rendered a small price chip next to each tour RSVP button.
- Set current tour labels to `Free` for all listed shows except the July 26, 2026 Mountain View Vineyard, Winery & Brewery show, which is labeled `$20`.
- Updated the tour sync normalizer to preserve manual paid price labels and automatically recognize free Bandsintown offers when the source marks an event as free.
- Updated `scripts/tour-sync.mjs`, package scripts, and `.github/workflows/bandsintown-sync.yml` so `BANDSINTOWN_APP_ID` uses the official Bandsintown for Artists API endpoint for artist ID `15511983`, while the verified widget all-events feed remains the fallback when no official key is configured.
- Important secret handling note: the Bandsintown API key is not committed. Store it as the GitHub Secret `BANDSINTOWN_APP_ID` and rotate it if the previously shared value should be considered exposed.

## 2026-07-10 — Full Bandsintown all-events scrape

- Rechecked Bandsintown using the widget JavaScript endpoint instead of the location-filtered artist page. The verified all-upcoming feed is `https://rest.bandsintown.com/V3.1/artists/Roots%20in%20Blue%20Stone/events/?app_id=js_roots-in-blue-stone.pages.dev`.
- Confirmed Bandsintown currently returns 15 upcoming Roots In Blue Stone events, not 14.
- Added the missing July 25, 2026 show to `lib/tour.ts`: `RIBS @ Jam Below The Dam`, White Haven, PA, Bandsintown event ID `107919906`.
- Updated the tour sync workflow and npm scripts to fetch the verified all-events feed by default; `BANDSINTOWN_EVENTS_URL` is now only an override secret, not a required source secret.
- Canonicalized Bandsintown event URLs during normalization so tracking query params do not create noisy PR diffs, ignored same-day `ends_at` values as non-multi-day events, and preserved existing curated venue/note text when merging full-feed data.
- Verification: `npm run tour:validate` now reports 15 shows; file-based full-feed sync reports 15 incoming / 15 current / 0 changes; live `npm run tour:sync` passed outside the sandbox after sandbox DNS failures; `npm run lint`, `npm run build`, and `npm run cf:build` passed.

## 2026-07-10 — Bandsintown autonomous PR sync

- Implemented the reviewed Bandsintown tour-date sync pipeline from `plans/bandsintown-sync-listener.md`.
- Added `scripts/tour-lib.mjs` and `scripts/tour-sync.mjs` to parse the current `lib/tour.ts` show array without executing it, normalize Bandsintown-style event JSON, validate dates/venues/statuses/URLs, merge new and changed shows, render a clean `SHOWS` diff, and produce PR summary artifacts.
- Added valid and invalid fixtures under `scripts/fixtures/` plus package scripts `tour:validate`, `tour:sync`, and `tour:sync:write`.
- Added `scripts/notify-llphant-tg.mjs` for optional LLPhant Telegram PR/failure alerts using GitHub Secrets, without committing bot tokens, chat IDs, or thread IDs.
- Added `.github/workflows/bandsintown-sync.yml`, a daily/manual GitHub Actions listener that fetches the verified Bandsintown all-events feed by default, optionally uses `BANDSINTOWN_EVENTS_URL` / `BANDSINTOWN_AUTH_TOKEN` overrides, validates updates, runs lint/build on changes, opens or updates an automated tour-date PR, and alerts LLPhant on Telegram when a PR is created.
- Default sync mode merge-preserves existing tour entries that are missing from the incoming source; explicit `--replace` / workflow `replace` input is available for deliberate full-source replacement.
- Configured RIBS GitHub Secrets for LLPhant Telegram alerts: `TELEGRAM_BOT_TOKEN_LLPHANT`, `LLPHANT_TG_CHAT_ID`, and `LLPHANT_TG_THREAD_ID`, without printing secret values or sending a live alert.
- Confirmed the old public Bandsintown REST endpoint and artist page are still not usable as direct scrape sources: REST returned `403 MissingAuthenticationTokenException`, and the public artist page returned HTTP 403 from shell access. The later all-events widget endpoint supersedes this as the default source.
- Verification: `npm run tour:validate`, fixture dry-run, invalid fixture failure, temp-copy write-mode diff, missing-source no-op, Telegram alert missing-secret no-op, `npm run lint`, `npm run build`, and `npm run cf:build` all passed locally.

## 2026-07-10 — Bandsintown sync listener plan

- Added `plans/bandsintown-sync-listener.md`, a full ExecPlan for a reviewed Bandsintown tour-date sync listener.
- The plan keeps `lib/tour.ts` as the website source of truth, adds Node-based parsing/validation/sync scripts, and uses a manual/scheduled GitHub Actions workflow to open reviewable tour-date PRs when Bandsintown event data changes.
- Captured the key constraint at the time: blind public artist-page scraping was blocked, so the integration needed a stable JSON source and review gate. The later all-events widget feed discovery now provides that source.

## 2026-07-10 — OG card and metadata correction

- Updated the root metadata title/OG/Twitter title to exactly `Roots in Blue Stone · Originals & Covers · Groove, Grit & Good Vibes`, and changed child-page title templates to the same middle-dot separator style.
- Replaced the generated TSX Open Graph/Twitter image routes with static 1200x630 PNG cards in `public/img/social/` so the artwork is deterministic, social-safe, and compatible with Cloudflare Pages.
- Restored the Break Down cover art to the right side of the share card, kept the band logo on the left, and rendered the tagline with the same Syne display font used by the website.
- Refined the share-card composition after staging review: removed the left-side frame/hairline treatment so it no longer reads like a second cover-art panel, reduced the tagline size, and aligned the logo/tagline against a cleaner left-column grid.
- Vertically centered the left logo/subtitle group in the share-card layout while keeping the right cover art fixed.
- Pointed Twitter metadata at the same refreshed `og-card.png` asset as Open Graph to avoid stale preview-card caching on the separate Twitter image path.
- Forced the `/book` page metadata title, Open Graph title, and Twitter title to the same exact `Roots in Blue Stone · Originals & Covers · Groove, Grit & Good Vibes` string so page-level metadata does not override the share title.
- Added `scripts/generate-og-card.mjs` plus the local Syne OFL font asset used to regenerate the card with a bounded headless Chrome screenshot.
- Verification: local browser-rendered card visually inspected; `npm run lint`, staging-aware `npm run build`, and staging-aware `npm run cf:build` passed. Deployed to the Cloudflare Pages `staging` alias at https://staging.roots-in-blue-stone.pages.dev.

## 2026-07-10 — Full-screen video lightbox

- Enlarged the YouTube lightbox player from the small `max-w-3xl` dialog to a viewport-sized 16:9 modal capped at `96vw` by `92svh`, so clicked videos open nearly full-screen on desktop and landscape screens while staying responsive on mobile.
- Verification: `npm run lint`, staging-aware `npm run build`, and staging-aware `npm run cf:build` passed; staging deployed to https://staging.roots-in-blue-stone.pages.dev and returned HTTP 200.

## 2026-07-10 — Simplified hero-style share card

- Reworked the generated Open Graph / Twitter image card to use a black background, the band logo on the left, and only the visible text `Groove, Grit & Good Vibes`, matching the homepage hero tagline.
- Removed the Break Down cover art, release label, originals/covers line, and genre copy from the share-card artwork.
- Verification: `npm run lint` and staging-aware `npm run build` passed; generated Open Graph and Twitter image bodies are valid 1200x630 PNGs; visual inspection confirmed the black hero-style card composition.

## 2026-07-10 — Staging OG metadata host fix

- Made root metadata resolve canonical, Open Graph, and Twitter image URLs from `NEXT_PUBLIC_SITE_URL` / `CF_PAGES_URL` at build time instead of always using the production `SITE.url`.
- Replaced em dashes in exported metadata titles, templates, alt text, and booking-page description with plain hyphen/prose copy.
- Rebuilt the Cloudflare Pages bundle with `NEXT_PUBLIC_SITE_URL=https://staging.roots-in-blue-stone.pages.dev` so staging share tags point to staging image routes.
- Verification: `npm run lint`, staging-aware `npm run build`, and staging-aware `npm run cf:build` passed; staging deployed to https://staging.roots-in-blue-stone.pages.dev; live metadata assertion confirmed staging canonical/OG/Twitter image URLs, no em/en dashes in metadata tags, and 200 responses from `/opengraph-image` and `/twitter-image`.

## 2026-07-10 — Share card and music player sync

- Replaced `app/favicon.ico` with a multi-size favicon generated from the Break Down cover art.
- Added generated Open Graph and Twitter share cards using the Break Down cover art and site logo, and updated root metadata away from the stale `/og.png` image.
- Reworked the Music section preview controls to use the shared `PlayerProvider`, so the Music play/progress bar, hero player, and sticky footer player all reflect the same audio state.
- Removed `Santa Claus Is Coming To Town` from the Music release carousel.
- Verification: favicon file probe confirmed a 4-size ICO; release source check confirmed 8 Music releases without `Santa Claus Is Coming To Town`; generated Open Graph and Twitter image bodies are 1200x630 PNGs; `npm run lint`, `npm run build`, and `npm run cf:build` passed; staging deployed to https://staging.roots-in-blue-stone.pages.dev and returned HTTP 200.

## 2026-07-10 — Gallery curation pass

- Removed the requested carousel positions from the rendered gallery without deleting source files: 20-27, 29, 39, 42, 45, 56-63, 79, 80, 85, 87-90, and 92-100.
- Rendered gallery count is now 66 images.
- Verification: direct gallery count probe returned 66 images; `npm run lint`, `npm run build`, and `npm run cf:build` passed; staging deployed to https://staging.roots-in-blue-stone.pages.dev and returned HTTP 200.

## 2026-07-10 — Gallery thumbnail tracking

- Updated the gallery carousel thumbnail rail so the active thumbnail auto-scrolls into the center as users move through photos with arrows, keyboard, or thumbnail clicks.
- Verification: source check confirmed the active thumbnail refs drive rail scrolling; `npm run lint` and `npm run build` passed.

## 2026-07-10 — Custom-hours quote tuning

- Updated the live booking quote calculator so 4+ hour custom performance lengths increase both the lower and upper estimate range as hours increase.
- Removed the custom-hours and band-provided-sound explanatory estimate note pills from the shared quote output, so they no longer appear on the homepage booking form or `/book`.
- Verification: direct quote probes confirmed 4/5/6/8-hour custom ranges change dynamically and the removed note text is absent; `npm run lint` and `npm run build` passed.

## 2026-07-08 — Walter launch notes pass

- Confirmed the site was using a static `lib/tour.ts` list, not a live Bandsintown API pull. Direct unauthenticated Bandsintown API requests returned authorization errors, and the public artist page was not reliable for shell scraping.
- Refreshed `lib/tour.ts` from accessible Shazam/Bandsintown-derived event listings with 14 upcoming shows from July 10, 2026 through December 19, 2026, removing stale June/early-July and incorrect edited dates.
- Updated About "Available as" labels to `Duo`, `4 Piece`, `5 Piece`, `7 Piece`; removed `Trio` from the public lineup display.
- Lowered public-show quote minimums in `lib/booking-quote.ts` per Walter's bar/restaurant guidance: Duo $500, 4-Piece $800, 5-Piece $1,000, and 7-Piece $1,400. Private, festival, and wedding ranges were left unchanged pending discussion.
- Removed the generic booking-estimate note pills prompting users to choose a lineup size or performance length.
- Added a production launch checklist plan at `plans/production-launch.md`.
- Verification: `npm run lint` and `npm run build` passed.

## 2026-07-03 — Launch polish and staging deploy

- Fixed the mobile hamburger menu logo so the sheet's flex-column layout no longer stretches the wordmark horizontally.
- Repaired the npm lockfile with `npm install`, restoring local lint/build/deploy commands after `npm ci` failed on missing `@emnapi` entries.
- Built and deployed the current worktree to the Cloudflare Pages `staging` branch alias: https://staging.roots-in-blue-stone.pages.dev.
- Restored the gallery carousel to the deterministic reverse-chronological `GALLERY` order and removed the per-refresh random shuffle.
- Redeployed the staging branch alias after restoring the gallery order.

## 2026-07-02 — Gallery dedupe

- Removed repeated photos from the rendered gallery without deleting source image files. The gallery now keeps the highest-quality Walter Drive versions for repeated site photos, keeps the six unique original site photos, and excludes the duplicated zip tail (`ribs-zip-085` through `ribs-zip-100`).
- Also excluded `ribs-zip-060` as a same-pose repeat of `ribs-zip-059`.
- Visible gallery count is now 102 unique entries instead of 132.
- Gallery carousel uses the deduped reverse-chronological photo order without randomizing on refresh.
- About now uses an explicit duo portrait (`/gallery/g09.jpg`) instead of a fragile gallery index, replacing the empty stage-light shot with a clearer Walter/Ian mountain portrait.

## 2026-06-28 — Break Down latest release + all-release music carousel

- Verified the actual latest Roots In Blue Stone release against current public Apple Music/iTunes metadata: **Break Down - Single**, released May 15, 2026. Walter's shared Drive folder, accessed through `aklonyc@gmail.com` Drive-only auth, also contains `RIBS SINGLE ART/Break Down Art.webp`, confirming the artwork identity; the Drive file is only 320px, so the site uses the verified 1200px Apple Music artwork locally.
- Updated the hero/sticky player featured release from `One Last Breath` to `Break Down`: cover art, LANDR smart link, Apple Music link, Spotify album link, Break Down preview audio, and platform links.
- Reworked the hero latest-release showcase from cover art plus platform buttons into a 2.5D flip card: the front shows the Break Down cover art, and the back is a compact preview player.
- Added `components/site/player-provider.tsx` so the hero flip-card player and sticky footer player use the same audio element, playback state, progress, seek, and dismiss controls.
- Added a lightweight reactive canvas waveform to the back of the hero single-art card, animated from the shared player state. The waveform stays visual-only; the player keeps a single bottom seek/time bar.
- Rebuilt the Music section from a two-column featured-release + Spotify embed layout into a single-column release carousel covering 9 releases: Break Down, One Last Breath, Santa Claus Is Coming To Town, Carry On, No Pasta in the Hot Tub, One Day, Borrowed Time, Amaranthus, and Live At the Hall Castle Inn. Removed `One Day (Radio Edit)` from the carousel.
- Each release carousel slide now has local 1200px cover art, release/date/track metadata, a preview player, release-specific buttons, arrow navigation, and thumbnail navigation.
- Desktop carousel chevrons sit outside the left and right sides of the release card; mobile keeps compact below-card controls.
- Music carousel platform buttons are icon-only with accessible labels/tooltips so the link row stays compact on one line.
- Release thumbnail navigation is centered when the catalog fits, and the active thumbnail auto-centers in the scroll strip as more releases are added.
- Music carousel proportions were tightened with a narrower card, smaller cover art, smaller title scale, and a more compact player.
- Sticky player now hides and pauses when the Music section is visible so it does not cover the release carousel/player.
- Booking estimate now sits at the top of the form as a slimmer inline header; its helper copy and note pills stay on single horizontal rows.
- Fixed booking form horizontal overflow when city/state adds the travel estimate note by constraining the booking grid/form min-width and shortening the travel note copy.
- Booking performance length now uses inline 2-hour / 3-hour quick options plus a compact integer custom-hours field for 4+ hour events; backline options now include "Will provide via email."
- Added 100 optimized gallery images from the downloaded `Photos-20260628T054608Z-3-00x.zip` RIBS archives, excluding logos, merch mockups, single artwork, `.DS_Store`, nested zips, and raw `OLD` material.
- Verification: `npm run lint` and `npm run build` passed. Browser verification confirmed Break Down appears in the hero, Music shows `1 / 9`, cover art loads at 1200x1200, platform buttons sit under the release, carousel navigation advances, and sticky player is hidden in Music.
- Note: local dev still logs pre-existing Base UI warnings about Button semantics in unrelated nav/hero/tour/video links; not addressed in this change.

## 2026-06-24 — Walter Drive photos + live booking estimate

- Reviewed Walter Lee's recent iMessage thread for RIBS requirements. Key implementation items: use his Google Drive photo folder, remove duplicate booking/event semantics, use lineup options Duo / 4-Piece / 5-Piece / 7-Piece, ask outdoor coverage/power only for outdoor events, avoid asking clients whether they need a sound engineer, cap Original Music sets at 2 hours, and show a narrow estimate instead of a fixed quote.
- Google Drive: the newest folder Walter sent listed empty via authenticated Drive API; the earlier high-res photo folder contained `FULL` and `FOR WEB` subfolders. Downloaded the 13 `FOR WEB` JPEGs locally, optimized them to 1800px max progressive JPEGs, and added them under `public/gallery/walter/`.
- Gallery now includes 32 images total: 19 existing site photos plus 13 Walter Drive photos.
- Added shared booking quote logic in `lib/booking-quote.ts`; the form now displays a live estimate while users fill it out, and `/api/book` includes the same estimate in the booking email summary.
- Updated the booking schema/form around Walter's pricing guide: public/private/festival/wedding ranges by lineup, 2-hour / 3-hour / custom length choices, large-audience and band-provided-sound adjustments, outdoor power/coverage prompts, and formal/upscale appearance toggle.
- Verification: `npm run lint` and `npm run build` passed. Browser verification on local dev confirmed gallery counter `1 / 32`, Walter images render, outdoor prompts appear when Outdoor is selected, a bar/restaurant 5-piece 3-hour 350-person case estimates `$2,250-$3,050`, and Original Music collapses length options to 2 hours with the cap note.
- Note: local dev still logs pre-existing Base UI warnings about Button semantics in unrelated nav/hero/tour/video links; not addressed in this change.

## 2026-06-18 — Hero release player evolution

- Removed genre badges from the hero.
- Iterated the hero "latest release" tile: Spotify iframe → custom minimal preview player → final: large **cover art linking to Apple Music** plus a **sticky scroll-following player**.
- `StickyPlayer` (`components/site/sticky-player.tsx`): slim monochrome bar that slides up past the hero and follows on scroll, plays the track's 30s preview (Spotify preview mp3), with Spotify + Apple links and a dismiss.
- Pulled real platform links via public APIs (no asks of Walter): Spotify track `2bLFDKSspU5NvQ4EwDxrA1` + preview mp3; Apple Music track `1881358433?i=1881358434` via the iTunes lookup API.

## 2026-06-18 — Carousels, full-color photos, brand/form polish

- Scraped 40 hi-res originals from the Wix CDN; curated 14 real band photos, resized/optimized into `public/gallery` (cover converted to lean jpg). Removed the raw-originals folder.
- Images now display in full color; only the hero stays black & white.
- Gallery → full-size carousel (one big image, arrows, counter, thumbnail strip) instead of a grid.
- Video → real YouTube channel carousel built from the channel RSS feed (12 videos: official music videos, Renegade Winery live sets, covers) with a lightbox player.
- Music section restructured to the stacked album layout on all breakpoints; square cover that never crops, minimal radius.
- Tightened card border-radii globally (buttons + pills unchanged).
- Footer uses the logo wordmark (never the band name in our font) + an ultra-minimal "Designed by NewSphere" credit. Same rule applied to the mobile menu and section titles ("Book the Band", "The Band").
- Booking form: "desired set length" is now a pill selector; added real Dusk social proof (5.0★ / 11 reviews, links to dusk.fm/@rootsinbluestone).
- Deep-dive finding: their EPK is a Dusk profile (dusk.fm/@rootsinbluestone). Merch intentionally still excluded.
- Redeployed staging: https://staging.roots-in-blue-stone.pages.dev (verified live: gallery + YouTube thumbnails load, all sections render).

## 2026-06-18 — Monochrome redesign

- Scraped the band's real assets from the Wix CDN (browser-based, since curl is 403'd) into `public/`: logo wordmark (`img/logo.png`), high-res stage photo (`img/hero-banner.jpg`), "One Last Breath" cover (`img/one-last-breath.png`), gallery shots (`gallery/g*.jpg`). Content now points at local files.
- Switched to a **monochrome chrome** palette — sleek black `#060606`, near-white `#f5f5f6` primary, grayscale + metallic-chrome highlights. Dropped the blue and amber accents.
- New fonts: **Syne** (display/headings), Geist (body), mono labels.
- Hero: real logo as the wordmark, grayscale stage photo background, floating tilted album cover in the right column, two CTAs (See Tour Dates / Book the Band).
- Nav: logo image; removed social icons; added Tour Dates + Book Now buttons.
- Photography rendered grayscale (`.mono`); album cover kept in its original color as the single focal accent.
- Copy audit: trimmed invented marketing lines; booking section now uses a verbatim bio quote; lineup blurbs removed (labels only).
- Redeployed staging: https://staging.roots-in-blue-stone.pages.dev (verified live: monochrome palette, logo/photo/cover all load, edge API ok).

## 2026-06-18

- Created `ribs` as a managed project workspace for the Roots in Blue Stone band site (client web project for AKLO).
- Scaffolded Next.js 16 + React 19 + Tailwind v4 + shadcn/ui (Base UI / `base-nova` preset), the first AKLO project to adopt shadcn.
- Built the **Bluestone Dark** design system in `app/globals.css`: deep slate-indigo base, frosted-glass utilities (`.glass`, `.glass-raised`), warm amber accents, radial page wash — ported from the `elegant` house style.
- Carried content over from the current Wix site (minus merch): bio, members (Walter Lee, Ian Kirk), "One Last Breath" release, originals, streaming + social links, gallery; all data-driven in `lib/content.ts`.
- Built single-scroll site: glass nav, hero with 3 priority CTAs (Tour / Latest Release / Book), tour list (`lib/tour.ts`, empty-state + PLACEHOLDER upcoming dates), music section with live Spotify embed, about + lineups, gallery lightbox, video, footer; plus a `/book` route.
- Built a 5-step booking inquiry form (react-hook-form + zod) capturing contact, event, performance, sound/backline, and budget details; `POST /api/book` sends via Resend with a graceful no-op when keys are absent.
- Verified: `npm run build` + `npm run lint` clean; browser walkthrough of all sections and full booking submit → success state.
- Pending: real Resend key + recipient, real tour dates, real photos, production deploy + DNS cutover (all approval-gated).
- Created private GitHub repo `aklo360/ribs` (https://github.com/aklo360/ribs) and pushed `main`.
- Deployed to Cloudflare Pages project `roots-in-blue-stone` (staging branch). Live: https://staging.roots-in-blue-stone.pages.dev. Built with `@cloudflare/next-on-pages` (works on Next 16); the edge `/api/book` route runs on CF (verified 200 valid / 422 invalid, graceful no-op without Resend keys).
- Verified live on Cloudflare across iPhone, iPad, tiny Android (360px), and desktop (1440) — no horizontal overflow, desktop layout preserved.
