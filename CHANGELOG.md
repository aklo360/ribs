# Changelog — Roots in Blue Stone (RIBS)

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
