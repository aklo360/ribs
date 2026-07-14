#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  TourValidationError,
  buildPrBody,
  diffShows,
  formatShowLine,
  mergeShows,
  normalizeRawBandsintownEvents,
  parseShowsFromTourSource,
  readTourFile,
  renderShowsArray,
  summaryForNoSource,
  validateShows,
  writeShowsToTourFile,
} from "./tour-lib.mjs";

const DEFAULT_TOUR_FILE = "lib/tour.ts";
const DEFAULT_FETCH_TIMEOUT_MS = 20_000;
const DEFAULT_BANDSINTOWN_ARTIST_ID = "15511983";
const DEFAULT_BANDSINTOWN_ARTIST_NAME = "Roots in Blue Stone";
const DEFAULT_BANDSINTOWN_APP_ID = "js_roots-in-blue-stone.pages.dev";

main().catch((error) => {
  if (error instanceof TourValidationError) {
    console.error("Tour validation failed:");
    for (const line of error.errors) console.error(`- ${line}`);
  } else {
    console.error(error instanceof Error ? error.message : String(error));
  }
  process.exitCode = 1;
});

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const tourFile = resolve(args.tourFile ?? DEFAULT_TOUR_FILE);
  const currentShows = validateShows(parseShowsFromTourSource(readTourFile(tourFile)));

  if (args.validateCurrent) {
    const first = currentShows[0]?.date ?? "n/a";
    const last = currentShows[currentShows.length - 1]?.date ?? "n/a";
    console.log(`Validated ${currentShows.length} shows from ${relativeTourFile(tourFile)}.`);
    console.log(`Date range: ${first} through ${last}.`);
    writeGithubOutputs({ changed: false, sourceConfigured: true });
    return;
  }

  const source = await loadSource(args);
  if (!source.configured) {
    const summary = {
      ...summaryForNoSource(),
      currentCount: currentShows.length,
      nextCount: currentShows.length,
    };
    printNoSource(summary);
    writeArtifacts(args, summary);
    writeGithubOutputs({ changed: false, sourceConfigured: false });
    return;
  }

  const incomingShows = normalizeRawBandsintownEvents(source.raw);
  if (!incomingShows.length) {
    throw new Error("Bandsintown source returned zero events. Refusing to update tour data.");
  }

  const nextShows = mergeShows(currentShows, incomingShows, { replace: args.replace });
  const diff = diffShows(currentShows, nextShows);
  const changed = diff.added.length > 0 || diff.changed.length > 0 || diff.removed.length > 0;
  const summary = {
    ok: true,
    source: source.label,
    sourceConfigured: true,
    replaceMode: args.replace,
    changed,
    currentCount: currentShows.length,
    incomingCount: incomingShows.length,
    nextCount: nextShows.length,
    added: diff.added,
    changedShows: diff.changed,
    removed: diff.removed,
  };

  printSummary(summary, args.write);
  writeArtifacts(args, summary);
  writeGithubOutputs({ changed, sourceConfigured: true });

  if (args.write && changed) {
    writeShowsToTourFile(tourFile, nextShows);
    console.log(`Updated ${relativeTourFile(tourFile)}.`);
  } else if (!args.write && changed) {
    console.log("Dry run only. Re-run with --write to update lib/tour.ts.");
    if (args.json) console.log(JSON.stringify({ nextShows: renderShowsArray(nextShows) }, null, 2));
  } else {
    console.log("Tour data is already up to date.");
  }
}

function parseArgs(argv) {
  const args = {
    write: false,
    replace: false,
    validateCurrent: false,
    sourceEnv: false,
    json: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--write") args.write = true;
    else if (arg === "--replace") args.replace = true;
    else if (arg === "--validate-current") args.validateCurrent = true;
    else if (arg === "--source-env") args.sourceEnv = true;
    else if (arg === "--json") args.json = true;
    else if (arg === "--tour-file") args.tourFile = requireValue(argv, ++i, arg);
    else if (arg === "--source-file") args.sourceFile = requireValue(argv, ++i, arg);
    else if (arg === "--summary-file") args.summaryFile = requireValue(argv, ++i, arg);
    else if (arg === "--pr-body-file") args.prBodyFile = requireValue(argv, ++i, arg);
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!args.sourceFile && !args.sourceEnv) args.sourceEnv = true;
  if (args.sourceFile && args.sourceEnv) throw new Error("Use only one of --source-file or --source-env.");
  return args;
}

async function loadSource(args) {
  if (args.sourceFile) {
    const filePath = resolve(args.sourceFile);
    return {
      configured: true,
      label: `file:${args.sourceFile}`,
      raw: JSON.parse(readFileSync(filePath, "utf8")),
    };
  }

  const configuredUrl = process.env.BANDSINTOWN_EVENTS_URL?.trim();
  const url = configuredUrl || defaultBandsintownEventsUrl();
  if (!url) return { configured: false, label: "env", raw: null };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), envInt("BANDSINTOWN_FETCH_TIMEOUT_MS", DEFAULT_FETCH_TIMEOUT_MS));
  try {
    const token = process.env.BANDSINTOWN_AUTH_TOKEN?.trim();
    const raw = await fetchJsonUrl(url, token, controller.signal);
    return { configured: true, label: configuredUrl ? "env:BANDSINTOWN_EVENTS_URL" : "default:Bandsintown V3.1 all-events feed", raw };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJsonUrl(url, token, signal) {
  try {
    const headers = { accept: "application/json" };
    if (token) headers.authorization = `Bearer ${token}`;
    const response = await fetch(url, { headers, signal });
    if (!response.ok) throw new Error(`Bandsintown source returned HTTP ${response.status}.`);
    return await response.json();
  } catch (error) {
    if (token) throw error;
    const body = execFileSync("curl", ["-fsSL", "--max-time", "20", "-H", "Accept: application/json", url], {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    });
    return JSON.parse(body);
  }
}

function defaultBandsintownEventsUrl() {
  if (process.env.BANDSINTOWN_DISABLE_DEFAULT_SOURCE === "1") return "";
  const officialAppId = process.env.BANDSINTOWN_APP_ID?.trim();
  const appId = officialAppId || DEFAULT_BANDSINTOWN_APP_ID;

  if (officialAppId) {
    const artistId = process.env.BANDSINTOWN_ARTIST_ID?.trim() || DEFAULT_BANDSINTOWN_ARTIST_ID;
    const artistName = process.env.BANDSINTOWN_ARTIST_NAME?.trim() || DEFAULT_BANDSINTOWN_ARTIST_NAME;
    const artistPath = artistId ? `id_${artistId}` : artistName;
    return `https://rest.bandsintown.com/artists/${encodeURIComponent(artistPath)}/events/?app_id=${encodeURIComponent(appId)}`;
  }

  const artistName = process.env.BANDSINTOWN_ARTIST_NAME?.trim() || DEFAULT_BANDSINTOWN_ARTIST_NAME;
  return `https://rest.bandsintown.com/V3.1/artists/${encodeURIComponent(artistName)}/events/?app_id=${encodeURIComponent(appId)}`;
}

function writeArtifacts(args, summary) {
  const publicSummary = {
    ok: summary.ok,
    source: summary.source,
    sourceConfigured: summary.sourceConfigured,
    replaceMode: summary.replaceMode,
    changed: summary.changed,
    currentCount: summary.currentCount,
    incomingCount: summary.incomingCount,
    nextCount: summary.nextCount,
    added: summary.added?.map(formatShowLine) ?? [],
    changedShows: summary.changedShows?.map(({ before, after }) => ({
      before: formatShowLine(before),
      after: formatShowLine(after),
    })) ?? [],
    removed: summary.removed?.map(formatShowLine) ?? [],
    message: summary.message,
  };

  if (args.summaryFile) {
    writeFileEnsured(args.summaryFile, `${JSON.stringify(publicSummary, null, 2)}\n`);
  }
  if (args.prBodyFile) {
    writeFileEnsured(args.prBodyFile, buildPrBody({
      ...summary,
      changed: summary.changedShows ?? [],
    }));
  }
}

function printNoSource(summary) {
  console.log(summary.message);
  console.log("Current shows:", summary.currentCount);
  console.log("Changed: false");
}

function printSummary(summary, write) {
  console.log(`Source: ${summary.source}`);
  console.log(`Mode: ${summary.replaceMode ? "replace" : "merge"}`);
  console.log(`Current shows: ${summary.currentCount}`);
  console.log(`Incoming shows: ${summary.incomingCount}`);
  console.log(`Next shows: ${summary.nextCount}`);
  console.log(`Added: ${summary.added.length}`);
  for (const show of summary.added) console.log(`  + ${formatShowLine(show)}`);
  console.log(`Changed: ${summary.changedShows.length}`);
  for (const change of summary.changedShows) console.log(`  ~ ${formatShowLine(change.after)}`);
  console.log(`Removed: ${summary.removed.length}`);
  for (const show of summary.removed) console.log(`  - ${formatShowLine(show)}`);
  console.log(`Write mode: ${write ? "enabled" : "disabled"}`);
}

function writeGithubOutputs({ changed, sourceConfigured }) {
  if (!process.env.GITHUB_OUTPUT) return;
  appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed ? "true" : "false"}\n`);
  appendFileSync(process.env.GITHUB_OUTPUT, `source_configured=${sourceConfigured ? "true" : "false"}\n`);
}

function writeFileEnsured(filePath, content) {
  const resolved = resolve(filePath);
  mkdirSync(dirname(resolved), { recursive: true });
  writeFileSync(resolved, content);
}

function requireValue(argv, index, flag) {
  const value = argv[index];
  if (!value) throw new Error(`${flag} requires a value.`);
  return value;
}

function envInt(name, fallback) {
  const parsed = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function relativeTourFile(filePath) {
  return filePath.endsWith(DEFAULT_TOUR_FILE) ? DEFAULT_TOUR_FILE : filePath;
}

function printHelp() {
  console.log([
    "Usage:",
    "  node scripts/tour-sync.mjs --validate-current",
    "  node scripts/tour-sync.mjs --source-file scripts/fixtures/bandsintown-events.sample.json",
    "  node scripts/tour-sync.mjs --source-file scripts/fixtures/bandsintown-events.sample.json --write",
    "  BANDSINTOWN_APP_ID=... node scripts/tour-sync.mjs --source-env --write",
    "  BANDSINTOWN_EVENTS_URL=https://... node scripts/tour-sync.mjs --source-env --write",
    "",
    "Options:",
    "  --write              Update lib/tour.ts when the normalized source differs",
    "  --replace            Replace missing current shows instead of merge-preserving them",
    "  --summary-file PATH  Write a redacted JSON summary",
    "  --pr-body-file PATH  Write a pull-request body summary",
  ].join("\n"));
}
