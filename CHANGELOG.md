# Changelog — Roots in Blue Stone (RIBS)

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
