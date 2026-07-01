import type { BookingInput } from "./booking-schema";

type Lineup = "Duo" | "4-Piece" | "5-Piece" | "7-Piece";
type EventBucket = "public" | "private" | "wedding" | "festival";

type BaseRange = {
  min: number;
  max: number;
};

const PUBLIC_SHOWS: Record<Lineup, BaseRange> = {
  Duo: { min: 600, max: 1200 },
  "4-Piece": { min: 1200, max: 2000 },
  "5-Piece": { min: 1500, max: 3000 },
  "7-Piece": { min: 2000, max: 4000 },
};

const PRIVATE_EVENTS: Record<Lineup, BaseRange> = {
  Duo: { min: 1000, max: 2000 },
  "4-Piece": { min: 1800, max: 2500 },
  "5-Piece": { min: 2200, max: 4000 },
  "7-Piece": { min: 3000, max: 5000 },
};

const FESTIVALS: Record<Lineup, BaseRange> = {
  Duo: { min: 400, max: 2000 },
  "4-Piece": { min: 800, max: 1200 },
  "5-Piece": { min: 1000, max: 2500 },
  "7-Piece": { min: 1400, max: 3500 },
};

const WEDDINGS: Record<Lineup, BaseRange> = {
  Duo: { min: 1500, max: 2500 },
  "4-Piece": { min: 2500, max: 4500 },
  "5-Piece": { min: 3500, max: 6000 },
  "7-Piece": { min: 5000, max: 8000 },
};

const isLineup = (value: BookingInput["lineup"]): value is Lineup =>
  value === "Duo" || value === "4-Piece" || value === "5-Piece" || value === "7-Piece";

function eventBucket(eventType: BookingInput["eventType"]): EventBucket {
  if (eventType === "Wedding") return "wedding";
  if (eventType === "Festival / Fundraiser") {
    return "festival";
  }
  if (eventType === "Private Party" || eventType === "Corporate Event") {
    return "private";
  }
  return "public";
}

function baseRange(bucket: EventBucket, lineup: Lineup): BaseRange {
  if (bucket === "private") return PRIVATE_EVENTS[lineup];
  if (bucket === "wedding") return WEDDINGS[lineup];
  if (bucket === "festival") return FESTIVALS[lineup];
  return PUBLIC_SHOWS[lineup];
}

function roundToNearest50(value: number) {
  return Math.round(value / 50) * 50;
}

function currency(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

export type BookingQuoteEstimate = {
  label: string;
  min: number;
  max: number;
  bucket: EventBucket;
  notes: string[];
  ready: boolean;
};

export function estimateBookingQuote(input: Partial<BookingInput>): BookingQuoteEstimate {
  const lineup = isLineup(input.lineup) ? input.lineup : "Duo";
  const bucket = eventBucket(input.eventType);
  const range = baseRange(bucket, lineup);
  const customHours =
    typeof input.customHours === "number" && Number.isFinite(input.customHours)
      ? input.customHours
      : undefined;
  const notes: string[] = [];

  let min = range.min;
  let max = range.max;

  if (!isLineup(input.lineup)) {
    notes.push("Choose a lineup size to tighten this range.");
  }

  if (input.repertoire === "Original Music") {
    max = Math.min(max, range.min + (range.max - range.min) * 0.55);
    notes.push("Original-music sets are capped at 2 hours.");
  } else if (input.setLength === "2 hours") {
    min = range.min + (range.max - range.min) * 0.15;
    max = range.min + (range.max - range.min) * 0.65;
  } else if (input.setLength === "3 hours") {
    min = range.min + (range.max - range.min) * 0.35;
    max = range.min + (range.max - range.min) * 0.85;
    notes.push("Most clients choose 3 hours.");
  } else if (customHours && customHours >= 4) {
    const extraLift = Math.min((customHours - 4) * 0.08, 0.32);
    min = range.min + (range.max - range.min) * (0.65 + extraLift);
    max = range.max;
    notes.push(`${customHours} hours requires a custom final quote.`);
  } else {
    notes.push("Select a performance length to tighten this range.");
  }

  const audience = Number.parseInt(String(input.audienceSize ?? "").replace(/\D/g, ""), 10);
  if (Number.isFinite(audience) && audience >= 300) {
    const lift = audience >= 750 ? 1.18 : 1.1;
    min *= lift;
    max *= lift;
    notes.push("Large attendance can increase production needs.");
  }

  if (input.soundProvided === "Band provides PA / sound") {
    min *= 1.12;
    max *= 1.2;
    notes.push("Band-provided PA, sound equipment, or engineer can increase pricing.");
  }

  if (input.formalDress) {
    min *= 1.06;
    max *= 1.1;
    notes.push("Formal presentation requirements may carry an additional fee.");
  }

  if (input.city || input.region) {
    notes.push("Travel may adjust the final quote.");
  }

  const finalMin = roundToNearest50(min);
  const finalMax = Math.max(roundToNearest50(max), finalMin + 50);

  return {
    label: `${currency(finalMin)}-${currency(finalMax)}`,
    min: finalMin,
    max: finalMax,
    bucket,
    notes,
    ready: Boolean(
      input.eventType && isLineup(input.lineup) && (input.setLength || customHours)
    ),
  };
}
