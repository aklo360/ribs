import { readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const ALLOWED_STATUSES = new Set(["onsale", "soldout", "free", "announced", "cancelled"]);
const SHOW_PROPERTY_ORDER = [
  "date",
  "endDate",
  "venue",
  "city",
  "region",
  "lineup",
  "note",
  "status",
  "priceLabel",
  "ticketUrl",
];

export class TourValidationError extends Error {
  constructor(errors) {
    super(errors.join("\n"));
    this.name = "TourValidationError";
    this.errors = errors;
  }
}

export function readTourFile(filePath) {
  return readFileSync(filePath, "utf8");
}

export function parseShowsFromTourSource(sourceText) {
  const { arrayNode, sourceFile } = findShowsArray(sourceText);
  return arrayNode.elements.map((element, index) => {
    if (!ts.isObjectLiteralExpression(element)) {
      throw new Error(`SHOWS[${index}] must be an object literal.`);
    }
    return evaluateShowObject(element, sourceFile, index);
  });
}

export function validateShows(shows) {
  const errors = [];
  const cleaned = [];
  const seen = new Map();

  if (!Array.isArray(shows)) {
    throw new TourValidationError(["Show data must be an array."]);
  }

  shows.forEach((show, index) => {
    const path = `show[${index}]`;
    if (!isRecord(show)) {
      errors.push(`${path} must be an object.`);
      return;
    }

    const next = {};
    for (const key of SHOW_PROPERTY_ORDER) {
      const value = show[key];
      if (value === undefined || value === null || value === "") continue;
      next[key] = typeof value === "string" ? value.trim() : value;
    }

    if (!isIsoDate(next.date)) {
      errors.push(`${path}.date must be YYYY-MM-DD.`);
    }
    if (next.endDate !== undefined && !isIsoDate(next.endDate)) {
      errors.push(`${path}.endDate must be YYYY-MM-DD when present.`);
    }
    if (isIsoDate(next.date) && isIsoDate(next.endDate) && next.endDate < next.date) {
      errors.push(`${path}.endDate must not be before date.`);
    }
    if (!nonEmptyString(next.venue)) {
      errors.push(`${path}.venue is required.`);
    }
    if (!nonEmptyString(next.city)) {
      errors.push(`${path}.city is required.`);
    }
    if (next.status !== undefined && !ALLOWED_STATUSES.has(next.status)) {
      errors.push(`${path}.status must be one of ${Array.from(ALLOWED_STATUSES).join(", ")}.`);
    }
    if (next.ticketUrl !== undefined && !isAbsoluteUrl(next.ticketUrl)) {
      errors.push(`${path}.ticketUrl must be an absolute URL.`);
    }

    const duplicateKey = `${next.date ?? ""}|${normalizeKey(next.venue)}|${normalizeKey(next.city)}`;
    if (next.date && next.venue && next.city) {
      const first = seen.get(duplicateKey);
      if (first !== undefined) {
        errors.push(`${path} duplicates show[${first}] for ${next.date} at ${next.venue}.`);
      } else {
        seen.set(duplicateKey, index);
      }
    }

    cleaned.push(next);
  });

  if (errors.length) throw new TourValidationError(errors);
  return cleaned.sort(compareShows);
}

export function normalizeRawBandsintownEvents(raw) {
  const events = extractEventArray(raw);
  return validateShows(events.map(normalizeRawEvent));
}

export function mergeShows(currentShows, incomingShows, options = {}) {
  const replace = options.replace === true;
  const current = validateShows(currentShows);
  const incoming = validateShows(incomingShows);
  const merged = new Map();

  if (!replace) {
    for (const show of current) merged.set(eventKey(show), show);
  }
  for (const show of incoming) {
    const key = eventKey(show);
    const existing = merged.get(key);
    merged.set(key, existing && !replace ? mergeExistingShow(existing, show) : show);
  }

  return validateShows(Array.from(merged.values()));
}

export function diffShows(currentShows, nextShows) {
  const current = new Map(validateShows(currentShows).map((show) => [eventKey(show), show]));
  const next = new Map(validateShows(nextShows).map((show) => [eventKey(show), show]));
  const added = [];
  const removed = [];
  const changed = [];

  for (const [key, show] of next.entries()) {
    const existing = current.get(key);
    if (!existing) {
      added.push(show);
    } else if (stableShowJson(existing) !== stableShowJson(show)) {
      changed.push({ before: existing, after: show });
    }
  }

  for (const [key, show] of current.entries()) {
    if (!next.has(key)) removed.push(show);
  }

  return { added: added.sort(compareShows), removed: removed.sort(compareShows), changed };
}

export function renderShowsArray(shows) {
  const validated = validateShows(shows);
  const lines = validated.map((show) => `  { ${renderShowProperties(show)} },`);
  return `[\n${lines.join("\n")}\n]`;
}

export function writeShowsToTourFile(filePath, shows) {
  const sourceText = readTourFile(filePath);
  const { arrayNode, sourceFile } = findShowsArray(sourceText);
  const start = arrayNode.getStart(sourceFile);
  const end = arrayNode.end;
  const nextSource = `${sourceText.slice(0, start)}${renderShowsArray(shows)}${sourceText.slice(end)}`;
  writeFileSync(filePath, nextSource);
}

export function formatShowLine(show) {
  const region = show.region ? `, ${show.region}` : "";
  const note = show.note ? ` (${show.note})` : "";
  return `${show.date} - ${show.venue} - ${show.city}${region}${note}`;
}

export function buildPrBody(summary) {
  const lines = [
    "## Bandsintown tour sync",
    "",
    "This PR was generated by `.github/workflows/bandsintown-sync.yml` after normalizing and validating incoming Bandsintown event data.",
    "",
    `Mode: ${summary.replaceMode ? "replace missing shows" : "merge new and changed shows"}`,
    `Current shows: ${summary.currentCount}`,
    `Incoming shows: ${summary.incomingCount}`,
    `Next shows: ${summary.nextCount}`,
    "",
    `Added: ${summary.added.length}`,
    ...formatShowList(summary.added),
    "",
    `Changed: ${summary.changed.length}`,
    ...formatChangedList(summary.changed),
    "",
    `Removed: ${summary.removed.length}`,
    ...formatShowList(summary.removed),
    "",
    "Validation passed. Review the changed tour dates before merging and deploying.",
  ];
  return `${lines.join("\n")}\n`;
}

export function summaryForNoSource() {
  return {
    ok: true,
    sourceConfigured: false,
    source: "env",
    replaceMode: false,
    changed: false,
    currentCount: 0,
    incomingCount: 0,
    nextCount: 0,
    added: [],
    changedShows: [],
    removed: [],
    message: "No Bandsintown source configured. Set BANDSINTOWN_EVENTS_URL to enable autonomous sync.",
  };
}

function findShowsArray(sourceText) {
  const sourceFile = ts.createSourceFile("tour.ts", sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let arrayNode;

  function visit(node) {
    if (arrayNode) return;
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === "SHOWS") {
      if (!node.initializer || !ts.isArrayLiteralExpression(node.initializer)) {
        throw new Error("SHOWS must be initialized with an array literal.");
      }
      arrayNode = node.initializer;
      return;
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  if (!arrayNode) throw new Error("Could not find exported SHOWS array in lib/tour.ts.");
  return { arrayNode, sourceFile };
}

function evaluateShowObject(node, sourceFile, index) {
  const show = {};
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) {
      throw new Error(`SHOWS[${index}] contains an unsupported property shape.`);
    }
    const key = propertyName(property.name);
    show[key] = evaluateExpression(property.initializer, sourceFile);
  }
  return show;
}

function propertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  throw new Error("Unsupported SHOWS property name.");
}

function evaluateExpression(node, sourceFile) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map((element) => evaluateExpression(element, sourceFile));
  if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "E") {
    const [arg] = node.arguments;
    if (arg && (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg))) {
      return `https://www.bandsintown.com/e/${arg.text}`;
    }
  }
  const text = node.getText(sourceFile);
  throw new Error(`Unsupported SHOWS expression: ${text}`);
}

function extractEventArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (!isRecord(raw)) throw new Error("Bandsintown source JSON must be an array or object.");

  for (const key of ["events", "data", "results", "result", "upcoming_events", "upcomingEvents"]) {
    const value = raw[key];
    if (Array.isArray(value)) return value;
    if (isRecord(value)) {
      const nested = extractEventArray(value);
      if (nested.length) return nested;
    }
  }

  if (isRecord(raw.artist)) return extractEventArray(raw.artist);
  if (raw.id || raw.datetime || raw.date || raw.venue) return [raw];
  throw new Error("Could not find an event array in Bandsintown source JSON.");
}

function normalizeRawEvent(event) {
  if (!isRecord(event)) throw new Error("Bandsintown event must be an object.");

  const venue = isRecord(event.venue) ? event.venue : {};
  const location = isRecord(event.location) ? event.location : {};
  const offers = Array.isArray(event.offers) ? event.offers.filter(isRecord) : [];
  const firstOffer = offers[0] ?? {};

  const date = toIsoDate(firstPresent(
    event.date,
    event.datetime,
    event.starts_at,
    event.startsAt,
    event.start_date,
    event.startDate,
    event.event_date,
    event.eventDate
  ));
  const endDate = toIsoDate(firstPresent(event.end_date, event.endDate, event.ends_at, event.endsAt));
  const id = cleanOptional(firstPresent(event.id, event.event_id, event.eventId));
  const explicitUrl = cleanOptional(firstPresent(
    event.url,
    event.event_url,
    event.eventUrl,
    event.ticket_url,
    event.ticketUrl,
    firstOffer.url
  ));
  const titleNote = cleanOptional(firstPresent(event.note, event.notes, event.subtitle));
  const status = normalizeStatus(firstPresent(
    event.sold_out === true ? "soldout" : undefined,
    event.status,
    event.event_status,
    event.eventStatus,
    event.ticket_status,
    event.ticketStatus,
    firstOffer.status,
    event.free === true ? "onsale" : undefined,
    event.cancelled,
    event.is_cancelled,
    event.isCancelled
  ));
  const priceLabel = normalizePriceLabel(firstPresent(
    event.priceLabel,
    event.price_label,
    event.ticketPriceLabel,
    event.ticket_price_label,
    event.price,
    event.ticketPrice,
    event.ticket_price,
    firstOffer.priceLabel,
    firstOffer.price_label,
    firstOffer.ticketPrice,
    firstOffer.ticket_price,
    firstOffer.price,
    event.free === true || offers.some(offerLooksFree) ? "Free" : undefined
  ));

  return {
    date,
    endDate: endDate && endDate !== date ? endDate : undefined,
    venue: cleanRequired(firstPresent(venue.name, event.venue_name, event.venueName, typeof event.venue === "string" ? event.venue : undefined), "venue"),
    city: cleanRequired(firstPresent(venue.city, location.city, event.city), "city"),
    region: cleanOptional(firstPresent(venue.region, venue.state, location.region, location.state, event.region, event.state)),
    lineup: normalizeLineup(event.lineup),
    note: titleNote,
    status,
    priceLabel,
    ticketUrl: id ? `https://www.bandsintown.com/e/${id}` : stripTrackingUrl(explicitUrl),
  };
}

function normalizeLineup(value) {
  if (typeof value === "string") return cleanOptional(value);
  if (!Array.isArray(value)) return undefined;
  const others = value
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .filter((item) => !/^roots in blue stone$/i.test(item));
  return others.length ? others.join(", ") : undefined;
}

function normalizeStatus(value) {
  if (value === true) return "cancelled";
  if (value === false || value === undefined || value === null || value === "") return undefined;
  const normalized = String(value).trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (["cancelled", "canceled"].includes(normalized)) return "cancelled";
  if (["soldout", "sold_out"].includes(normalized)) return "soldout";
  if (["free"].includes(normalized)) return "free";
  if (["announced"].includes(normalized)) return "announced";
  if (["onsale", "on_sale", "available", "tickets_available"].includes(normalized)) return "onsale";
  return normalized;
}

function normalizePriceLabel(value) {
  const cleaned = cleanOptional(value);
  if (!cleaned) return undefined;
  if (/^free$/i.test(cleaned)) return "Free";
  if (/^\$\d+(?:\.\d{1,2})?$/.test(cleaned)) return cleaned.replace(/\.00$/, "");
  if (/^\d+(?:\.\d{1,2})?$/.test(cleaned)) {
    const amount = Number(cleaned);
    if (!Number.isNaN(amount)) return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`;
  }
  return cleaned;
}

function offerLooksFree(offer) {
  if (!isRecord(offer)) return false;
  return [offer.type, offer.status, offer.name, offer.title, offer.description]
    .some((value) => typeof value === "string" && /\bfree\b/i.test(value));
}

function mergeExistingShow(existing, incoming) {
  return {
    ...incoming,
    venue: existing.venue ?? incoming.venue,
    city: existing.city ?? incoming.city,
    region: existing.region ?? incoming.region,
    lineup: existing.lineup ?? incoming.lineup,
    note: existing.note ?? incoming.note,
    ticketUrl: incoming.ticketUrl ?? existing.ticketUrl,
    status: incoming.status ?? existing.status,
    priceLabel: incoming.priceLabel ?? (isManualPriceLabel(existing.priceLabel) ? existing.priceLabel : undefined),
  };
}

function isManualPriceLabel(value) {
  return typeof value === "string" && value.trim() !== "" && !/^free$/i.test(value.trim());
}

function firstPresent(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function toIsoDate(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const text = String(value).trim();
  const match = text.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;
  return date.toISOString().slice(0, 10);
}

function cleanRequired(value, name) {
  const cleaned = cleanOptional(value);
  if (!cleaned) throw new Error(`Bandsintown event missing ${name}.`);
  return cleaned;
}

function cleanOptional(value) {
  if (value === undefined || value === null) return undefined;
  const cleaned = String(value).trim();
  return cleaned || undefined;
}

function stripTrackingUrl(value) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.hostname === "www.bandsintown.com" && url.pathname.startsWith("/e/")) {
      return `${url.origin}${url.pathname}`;
    }
    return url.toString();
  } catch {
    return value;
  }
}

function renderShowProperties(show) {
  return SHOW_PROPERTY_ORDER
    .filter((key) => show[key] !== undefined && show[key] !== null && show[key] !== "")
    .map((key) => `${key}: ${renderValue(key, show[key])}`)
    .join(", ");
}

function renderValue(key, value) {
  if (key === "ticketUrl" && typeof value === "string") {
    const match = value.match(/^https:\/\/www\.bandsintown\.com\/e\/([^/?#]+)(?:[/?#].*)?$/);
    if (match) return `E(${JSON.stringify(match[1])})`;
  }
  return JSON.stringify(value);
}

function formatShowList(shows) {
  if (!shows.length) return ["- None"];
  return shows.map((show) => `- ${formatShowLine(show)}`);
}

function formatChangedList(changes) {
  if (!changes.length) return ["- None"];
  return changes.map(({ before, after }) => `- ${formatShowLine(after)} (was: ${formatShowLine(before)})`);
}

function compareShows(a, b) {
  return String(a.date).localeCompare(String(b.date))
    || String(a.venue).localeCompare(String(b.venue))
    || String(a.city).localeCompare(String(b.city));
}

function stableShowJson(show) {
  const ordered = {};
  for (const key of SHOW_PROPERTY_ORDER) {
    if (show[key] !== undefined && show[key] !== null && show[key] !== "") ordered[key] = show[key];
  }
  return JSON.stringify(ordered);
}

function eventKey(show) {
  const ticketId = typeof show.ticketUrl === "string"
    ? show.ticketUrl.match(/bandsintown\.com\/e\/([^/?#]+)/)?.[1]
    : undefined;
  if (ticketId) return `bandsintown:${ticketId}`;
  return `show:${show.date}|${normalizeKey(show.venue)}|${normalizeKey(show.city)}`;
}

function normalizeKey(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isAbsoluteUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
