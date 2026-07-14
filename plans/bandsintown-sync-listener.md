# Bandsintown Reviewed Tour Sync Listener

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan follows `~/.codex/PLANS.md`. No repository-local PLANS.md exists, so the global planning standard is the governing format.

## Purpose / Big Picture

Roots in Blue Stone tour dates currently live in a static TypeScript file. That means a new Bandsintown show does not appear on the website unless someone notices it and edits the repo. After this plan is complete, a scheduled sync job will check the verified Bandsintown all-events widget feed, normalize the result into the site's `Show` shape, validate the dates, and produce a reviewable website update instead of silently trusting scraped data.

The user-visible outcome is simple: when Bandsintown has a new show, the project can detect it and update `lib/tour.ts` with a sorted, validated show list. In launch-safe mode, the automation opens a pull request that AKLO can review, merge, and deploy through the existing Cloudflare Pages process. If AKLO later approves fully automatic publishing, the same sync foundation can be connected to an auto-deploy path, but this plan deliberately keeps production publishing approval-gated.

## Progress

- [x] (2026-07-10 07:09Z) Read the project rules, changelog, local memory, current static tour file, package scripts, and production launch plan.
- [x] (2026-07-10 07:09Z) Confirmed that `lib/tour.ts` is static and that there is no existing `.github` workflow directory.
- [x] (2026-07-10 07:09Z) Confirmed prior direct unauthenticated Bandsintown REST probing returned an authorization-style error, so the plan must not depend on blind public REST pulls.
- [x] (2026-07-10 07:09Z) Created this ExecPlan to define the full implementation path.
- [x] (2026-07-10 07:18Z) Implemented a parser/validator for the current `lib/tour.ts` show array in `scripts/tour-lib.mjs`.
- [x] (2026-07-10 07:18Z) Implemented source adapters for a Bandsintown JSON endpoint and local JSON fixtures.
- [x] (2026-07-10 07:18Z) Implemented normalization from common Bandsintown-style event fields into the local `Show` object shape.
- [x] (2026-07-10 07:18Z) Implemented a safe writer that updates only the `SHOWS` array in `lib/tour.ts`.
- [x] (2026-07-10 07:18Z) Added valid and invalid fixtures under `scripts/fixtures/`.
- [x] (2026-07-10 07:18Z) Added package scripts for local dry runs, validation, and write mode.
- [x] (2026-07-10 07:18Z) Added a GitHub Actions workflow that runs manually and on a daily schedule, then opens or updates a pull request when the validated tour list changes.
- [x] (2026-07-10 07:18Z) Added optional LLPhant Telegram PR and failure alerts through `scripts/notify-llphant-tg.mjs`.
- [x] (2026-07-10 07:18Z) Documented the operator workflow and GitHub Secret configuration in `README.md` and local architecture context.
- [x] (2026-07-10 07:18Z) Ran `npm run tour:validate`, fixture dry-run, invalid fixture failure, temp-copy write-mode diff, missing-source no-op, Telegram missing-secret no-op, `npm run lint`, `npm run build`, and `npm run cf:build`.
- [x] (2026-07-10 17:18Z) Configured RIBS GitHub Secrets for LLPhant Telegram alerts: `TELEGRAM_BOT_TOKEN_LLPHANT`, `LLPHANT_TG_CHAT_ID`, and `LLPHANT_TG_THREAD_ID`, without printing values.
- [x] (2026-07-10 17:21Z) Found and verified the Bandsintown V3.1 widget all-events feed, which returns 15 upcoming events and includes the missing July 25, 2026 White Haven / Jam Below The Dam show.
- [x] (2026-07-10 17:21Z) Added the missing July 25, 2026 White Haven show to `lib/tour.ts`.
- [x] (2026-07-10 17:21Z) Updated the npm scripts and GitHub workflow to use the verified all-events feed by default, with `BANDSINTOWN_EVENTS_URL` remaining as an optional override.
- [x] (2026-07-10 17:21Z) Verified full-feed sync reports 15 current shows, 15 incoming shows, and zero changes after the correction.

## Surprises & Discoveries

- Observation: The website is not currently using a live Bandsintown API at all.
  Evidence: `lib/tour.ts` exports a hard-coded `SHOWS` array and includes a comment saying the list is static.
- Observation: The repository has no existing GitHub Actions workflow directory.
  Evidence: `rg --files .github` reported that `.github` does not exist.
- Observation: A simple unauthenticated Bandsintown REST pull is not a reliable foundation for automation.
  Evidence: prior direct endpoint probing returned an authorization-style response instead of event JSON, and the production launch plan already records that the public artist page was not reliable for shell scraping.
- Observation: The old public REST endpoint still returns an authorization-style response on 2026-07-10.
  Evidence: `curl -I https://rest.bandsintown.com/artists/Roots%20in%20Blue%20Stone/events?app_id=ribs-site-sync` returned `HTTP/1.1 403 Forbidden` with `x-amzn-ErrorType: MissingAuthenticationTokenException`.
- Observation: Merge mode is safer than replacement mode for the default scheduled workflow.
  Evidence: fixture dry-run with two incoming events produced one added show and one changed show while preserving the 13 current shows that were absent from the partial fixture.
- Observation: The public Bandsintown artist page is also blocked from shell access.
  Evidence: `curl -L -A 'Mozilla/5.0' https://www.bandsintown.com/a/15511983-roots-in-blue-stone` returned HTTP 403 with a small error page body.
- Observation: The Bandsintown widget script exposes a working all-events endpoint.
  Evidence: `https://widget.bandsintown.com/main.min.js` calls `https://rest.bandsintown.com/V3.1/artists/<artist>/events/` for upcoming events. Querying `https://rest.bandsintown.com/V3.1/artists/Roots%20in%20Blue%20Stone/events/?app_id=js_roots-in-blue-stone.pages.dev` returned HTTP 200 with 15 upcoming events.
- Observation: Local sandbox DNS can fail for `rest.bandsintown.com` even when the host is reachable outside the sandbox.
  Evidence: sandboxed `npm run tour:sync` returned curl error 6, then the same command passed outside the sandbox and reported 15 incoming events with zero changes.

## Decision Log

- Decision: Build a reviewed sync listener first, not a silent scraper or direct production publisher.
  Rationale: Tour data affects public customer-facing information. Bandsintown access is not currently proven through an official unauthenticated API, and project rules require careful confirmation before deploy-flow changes.
  Date/Author: 2026-07-10 / LLPhant.
- Decision: Keep `lib/tour.ts` as the website's source of truth for this implementation.
  Rationale: The current app already imports `SHOWS` from this file, and keeping the public runtime unchanged minimizes launch risk. The automation can update that file through a reviewable diff.
  Date/Author: 2026-07-10 / LLPhant.
- Decision: Use Node scripts and GitHub Actions for the first listener implementation instead of a Cloudflare Worker plus KV store.
  Rationale: The project is a statically rendered Next.js site deployed to Cloudflare Pages. A scheduled GitHub workflow can update the repo with less runtime complexity than adding a second live data store and client-side fetch path.
  Date/Author: 2026-07-10 / LLPhant.
- Decision: Do not rely on public-page scraping by default.
  Rationale: Scraping is brittle, may be blocked, and can create terms-of-service risk. A scrape adapter should only be added later if AKLO explicitly approves that tradeoff and the implementation remains polite, rate-limited, and review-gated.
  Date/Author: 2026-07-10 / LLPhant.
- Decision: Keep the event endpoint configurable even after finding the default all-events feed.
  Rationale: `BANDSINTOWN_EVENTS_URL` allows the implementation to switch to an official endpoint or export URL later without another code change, while the default feed handles normal operation now.
  Date/Author: 2026-07-10 / LLPhant.
- Decision: Default the sync to merge mode and expose replacement as an explicit `--replace` / workflow input.
  Rationale: Merge mode can autonomously add and update shows without deleting the current tour list if the source is partial, temporarily broken, or incorrectly scoped. Replacement remains available for a verified full event export.
  Date/Author: 2026-07-10 / LLPhant.
- Decision: Send LLPhant Telegram alerts from the GitHub workflow through secrets-backed Telegram Bot API calls.
  Rationale: The workflow runs on GitHub-hosted infrastructure, so it cannot use the Mini's local `~/.secrets.env`. Reading bot/chat/thread values from GitHub Secrets keeps credentials out of the repo while still delivering PR alerts to the LLPhant Telegram topic.
  Date/Author: 2026-07-10 / LLPhant.
- Decision: Use the verified Bandsintown V3.1 widget all-events feed as the default source.
  Rationale: It returns all upcoming events for the artist and is not limited to local show recommendations. `BANDSINTOWN_EVENTS_URL` remains available as an override if the endpoint changes.
  Date/Author: 2026-07-10 / LLPhant.

## Outcomes & Retrospective

Implementation is complete locally. The repository now has Node scripts for tour parsing, validation, sync, PR summary generation, and LLPhant Telegram alerts, plus a scheduled/manual GitHub Actions workflow. LLPhant Telegram target secrets are configured in GitHub. The sync now has a verified default all-events Bandsintown source and no longer requires `BANDSINTOWN_EVENTS_URL` for normal operation.

## Context and Orientation

This repository is a Next.js 16, React 19, and Tailwind v4 marketing and booking site for Roots in Blue Stone. The home page renders tour dates through `components/site/tour-dates.tsx`, which reads the local `upcomingShows` helper from `lib/tour.ts`. The `Show` type in `lib/tour.ts` contains `date`, optional `endDate`, `venue`, `city`, optional `region`, optional `lineup`, optional `ticketUrl`, optional `status`, and optional `note`.

A "listener" in this plan means a scheduled automation job. It is not a webhook because Bandsintown has not provided a project webhook in this repo. The listener will poll, which means it checks for changes on an interval, then updates the repo only when the normalized event list differs from the current `SHOWS` array.

The existing deployment target is Cloudflare Pages project `roots-in-blue-stone`. Current project rules say production deploys and DNS cutovers require explicit approval. This plan does not change production deploy behavior. The first implementation creates a reviewable data update; deployment remains separate unless AKLO explicitly approves an auto-deploy follow-up.

The default data source is the Bandsintown V3.1 all-events widget feed for Roots in Blue Stone. The implementation also supports `BANDSINTOWN_EVENTS_URL`, an environment variable containing an alternate official or approved event JSON URL. If that source requires a bearer token, support `BANDSINTOWN_AUTH_TOKEN` and send it as an `Authorization: Bearer ...` header. The scripts must never print either value.

## Plan of Work

First, create script infrastructure under `scripts/` for reading, validating, normalizing, and writing tour data. Add `scripts/tour-lib.mjs` as the shared utility module. It should use the installed `typescript` package to parse `lib/tour.ts` into an abstract syntax tree, which is a structured representation of the code. The parser should find the exported `SHOWS` array without executing arbitrary code. It may evaluate string literals and calls shaped exactly like `E("107919898")`, because that is how the current file builds Bandsintown event URLs.

Next, add validation. The validator should reject missing dates, non-ISO dates, invalid date order when `endDate` is present, missing venue names, missing cities, duplicate events with the same date and venue, unsupported status values, and ticket URLs that are neither a Bandsintown event URL nor a valid absolute URL. It should sort accepted shows by date ascending because `upcomingShows` expects chronological behavior.

Then, add source adapters. The file adapter should read a local fixture or export JSON through `--source-file path/to/events.json`; this makes the system testable without network or secrets. The live sync path should fetch the verified all-events widget feed by default and use `BANDSINTOWN_EVENTS_URL` plus optional `BANDSINTOWN_AUTH_TOKEN` only when an override is configured. The adapter should accept common event field names such as `id`, `url`, `datetime`, `date`, `venue.name`, `venue.city`, `venue.region`, `title`, and `status`, then map them into the local `Show` shape.

After source parsing works, add `scripts/tour-sync.mjs`. In dry-run mode it should print a concise summary: current event count, incoming event count, added events, removed events, changed events, and whether `lib/tour.ts` would change. In write mode it should update only the `SHOWS` array in `lib/tour.ts` while preserving the type definitions, helper functions, and surrounding comments. If necessary, add clear generated markers around the `SHOWS` block so future replacements are safe and obvious.

Add package scripts to `package.json`: `tour:validate` for checking the current `lib/tour.ts`, `tour:sync` for dry-run sync, and `tour:sync:write` for applying a source update. Keep dependencies minimal; use Node built-ins and the already installed `typescript` dev dependency.

Add fixtures under `scripts/fixtures/`. One fixture should represent the current kind of Bandsintown data with at least two valid events. Another should include edge cases: duplicate venue/date, cancelled event, missing city, and a changed event title or note. The validation command should prove that bad input fails with a nonzero exit code and useful message.

Finally, add `.github/workflows/bandsintown-sync.yml`. It should run on `workflow_dispatch` so AKLO can test it manually. After AKLO approves the notification behavior, it can also run on a daily `schedule`. The workflow should install dependencies with `npm ci`, run the sync in write mode using repository secrets, validate the result, run lint and build, and create a pull request only if the generated diff changes `lib/tour.ts`. The pull request body should include the added, changed, and removed shows so review is quick.

## Concrete Steps

Work from the repository root:

    cd /Users/llphant/projects/ribs

Create the shared tour utility:

    scripts/tour-lib.mjs

It must export functions with these names:

    readTourFile(filePath)
    parseShowsFromTourSource(sourceText)
    validateShows(shows)
    normalizeRawBandsintownEvents(rawEvents)
    renderShowsArray(shows)
    writeShowsToTourFile(filePath, shows)
    diffShows(currentShows, nextShows)

Create the sync command:

    scripts/tour-sync.mjs

It must support these invocations:

    node scripts/tour-sync.mjs --validate-current
    node scripts/tour-sync.mjs --source-file scripts/fixtures/bandsintown-events.sample.json
    node scripts/tour-sync.mjs --source-file scripts/fixtures/bandsintown-events.sample.json --write
    npm run tour:sync

Add package scripts:

    "tour:validate": "node scripts/tour-sync.mjs --validate-current",
    "tour:sync": "curl ...all-events feed... && node scripts/tour-sync.mjs --source-file /tmp/ribs-bandsintown-events.json",
    "tour:sync:write": "curl ...all-events feed... && node scripts/tour-sync.mjs --source-file /tmp/ribs-bandsintown-events.json --write"

Add fixture files:

    scripts/fixtures/bandsintown-events.sample.json
    scripts/fixtures/bandsintown-events.invalid.json

Add the GitHub workflow:

    .github/workflows/bandsintown-sync.yml

The initial workflow should include `workflow_dispatch`. The scheduled trigger should either be commented with a clear enablement note or added only after AKLO explicitly approves automatic PR creation. When enabled, daily polling is enough; the tour list does not need minute-by-minute updates.

Run local validation:

    npm run tour:validate
    node scripts/tour-sync.mjs --source-file scripts/fixtures/bandsintown-events.sample.json
    node scripts/tour-sync.mjs --source-file scripts/fixtures/bandsintown-events.invalid.json
    npm run lint
    npm run build

The invalid fixture command should fail. If it exits 0, the validation is too loose.

## Validation and Acceptance

The implementation is accepted when these behaviors are observable from a clean checkout.

Running `npm run tour:validate` succeeds against the current `lib/tour.ts` and prints a summary like:

    Validated 15 shows from lib/tour.ts.
    Date range: 2026-07-10 through 2026-12-19.

Running the sample sync without write mode shows what would change and leaves `lib/tour.ts` untouched:

    node scripts/tour-sync.mjs --source-file scripts/fixtures/bandsintown-events.sample.json
    Current shows: 14
    Incoming shows: 2
    Added: 1
    Changed: 1
    Removed: 0
    Dry run only. Re-run with --write to update lib/tour.ts.

Running the sample sync with write mode updates only the tour data block:

    node scripts/tour-sync.mjs --source-file scripts/fixtures/bandsintown-events.sample.json --write

After write mode, `git diff -- lib/tour.ts` should show only a clean show-list change. It must not reformat unrelated files or alter helper functions such as `upcomingShows` or `formatShowDate`.

Running the invalid fixture fails with a readable validation message and a nonzero exit code:

    node scripts/tour-sync.mjs --source-file scripts/fixtures/bandsintown-events.invalid.json
    Error: duplicate event for 2026-08-01 at Finola's Irish Pub

Running `npm run lint` and `npm run build` succeeds after the scripts and workflow are added.

The GitHub Actions workflow is accepted when a manual run with the default all-events feed or a fixture creates no PR if the tour list is unchanged, and creates exactly one pull request if the normalized source differs from `lib/tour.ts`. The PR must contain the generated `lib/tour.ts` diff and a summary of added, removed, and changed shows.

No production deploy is part of acceptance for this plan. A production deploy remains a separate approval-gated action.

## Idempotence and Recovery

All local scripts must be safe to rerun. Dry-run mode must never edit files. Write mode must produce the same `lib/tour.ts` output when run repeatedly with the same source input.

If the Bandsintown source fails, the scheduled workflow should exit without changing files and should print a redacted message explaining that fetching failed. It should not delete all shows or replace the current tour list with an empty array.

If a bad event appears in the source, validation should block the update before any pull request is created. The current website remains on the last committed `lib/tour.ts` list.

If a generated pull request is wrong, close the PR. If it was merged accidentally, revert the merge commit and redeploy the previous known-good site. Because the implementation updates a static file, Git history is the rollback mechanism.

If automatic scheduled PR creation is enabled and becomes noisy, disable the cron line in `.github/workflows/bandsintown-sync.yml` while keeping `workflow_dispatch` for manual runs.

## Artifacts and Notes

Current static tour file evidence:

    lib/tour.ts exports SHOWS directly.
    The file comment says this is a static launch list, not a live API pull.

Current package scripts before this plan:

    dev, build, start, lint, cf:build, cf:deploy

Current deploy posture:

    Cloudflare Pages project: roots-in-blue-stone
    Staging alias: staging.roots-in-blue-stone.pages.dev
    Production deploy and DNS cutover: explicit approval required

Security and privacy notes:

    Never commit a Bandsintown token.
    Never print secret-bearing URLs in CI logs.
    Do not scrape the public Bandsintown page unless AKLO approves that specific approach.
    Do not auto-publish production tour changes until AKLO approves the deploy behavior.

## Interfaces and Dependencies

Use Node.js scripts with `.mjs` modules. Use Node built-ins for file I/O, argument parsing, URL validation, and fetch. Use the installed `typescript` dev dependency to parse `lib/tour.ts` safely instead of executing arbitrary TypeScript or using fragile regular expressions for the whole file.

The local `Show` object shape remains:

    {
      date: "YYYY-MM-DD",
      endDate: "YYYY-MM-DD" or omitted,
      venue: "Venue Name",
      city: "City",
      region: "PA" or omitted,
      lineup: "Acoustic" or omitted,
      ticketUrl: "https://www.bandsintown.com/e/..." or omitted,
      status: "onsale" | "soldout" | "free" | "announced" | "cancelled" or omitted,
      note: "Short note" or omitted
    }

The normalized source event shape inside `scripts/tour-lib.mjs` should be documented with JSDoc:

    @typedef {Object} NormalizedShow
    @property {string} date
    @property {string=} endDate
    @property {string} venue
    @property {string} city
    @property {string=} region
    @property {string=} lineup
    @property {string=} ticketUrl
    @property {"onsale"|"soldout"|"free"|"announced"|"cancelled"=} status
    @property {string=} note

The workflow can use optional GitHub repository secrets:

    BANDSINTOWN_EVENTS_URL
    BANDSINTOWN_AUTH_TOKEN

`BANDSINTOWN_EVENTS_URL` is optional and overrides the default all-events widget feed. `BANDSINTOWN_AUTH_TOKEN` is optional and should be sent as a bearer token when present.

At the end of implementation, the project should still run through the existing checks:

    npm run lint
    npm run build
    npm run cf:build

`npm run cf:build` is useful before any staging deploy, but this plan does not require a deploy to prove the listener works.

## Revision Notes

2026-07-10: Initial plan created after confirming the current tour list is static, unauthenticated Bandsintown access is not a reliable source, and the repository has no existing GitHub workflow for this automation.
