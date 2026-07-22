# RIBS Memories

> Current project snapshot only. Full prior memory is preserved in `.codex/context-archive/memories-through-20260721.md` and must be searched selectively.

- Registered session root: `/Users/llphant/projects/ribs`; private GitHub repository is `aklo360/ribs`.
- Roots in Blue Stone is a band marketing and booking site built with Next.js 16, React 19, Tailwind CSS v4, and shadcn/ui. Current design is monochrome/chrome; source content is data-driven in `lib/content.ts`, `lib/tour.ts`, and `lib/merch.ts`.
- Current latest release is `Break Down`. Hero and sticky-player audio share state; the Music section uses the curated release carousel and local cover assets.
- Booking uses the multi-step form, `lib/booking-schema.ts`, and `lib/booking-quote.ts`; email delivery depends on configured provider secrets and must fail visibly when unavailable. Sound/PA choices are informational and custom 4+ hour estimates scale with entered hours.
- Staging has previously run on Cloudflare Pages project `roots-in-blue-stone`, but verify current code and live state before claiming readiness. Production deploy, DNS cutover, email credentials, client contact, and publication remain explicit-approval actions.
