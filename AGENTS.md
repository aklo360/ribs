<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Repository Guidelines

Roots in Blue Stone (RIBS) — band marketing + booking site. Client web project
for AKLO. Next.js 16 + React 19 + Tailwind v4 + shadcn/ui, deploying to
Cloudflare Pages.

## Project Structure
- `app/`: App Router pages (`page.tsx` home, `book/` booking page, `api/book/` Resend route) and `globals.css` (Bluestone Dark design system).
- `components/site/`: page sections (nav, hero, tour, music, about, gallery, video, footer).
- `components/booking/`: multi-step booking form.
- `components/ui/`: shadcn/ui (Base UI) primitives.
- `lib/`: editable content (`content.ts`, `tour.ts`) and `booking-schema.ts`.
- `.codex/` and `.claude/`: local project context. Do not duplicate global rules here.

## Commands
- `npm run dev`: local dev at http://localhost:3000.
- `npm run build` / `npm run lint`: production build + lint.
- `npm run cf:deploy`: Cloudflare Pages deploy — confirm target/domain first.

## Working Rules
- Design language is **Bluestone Dark**: deep slate-indigo base, frosted glass (`.glass` / `.glass-raised`), warm amber (`--primary` `#e0a84f`) accents, dark-first. Keep it app-like (Spotify/dusk.fm feel).
- All band content is data-driven in `lib/`. Edit data there, not in components.
- `lib/tour.ts` has PLACEHOLDER upcoming shows — replace with real dates before launch.
- Booking emails need `RESEND_API_KEY` + `BOOKING_TO_EMAIL`; the form degrades gracefully without them. Never commit secrets.
- Images use `SmartImage` with a branded fallback; Wix CDN blocks hotlinking, so prefer dropping real assets into `public/`.
- Do not run a production deploy or DNS cutover without explicit approval. Push as `aklo360`.
