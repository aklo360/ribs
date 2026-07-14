import type { BookingInput } from "./booking-schema";

type Lineup = "Duo" | "4-Piece" | "5-Piece" | "7-Piece";
type EventBucket = "public" | "private" | "wedding" | "fundraiser";

type BaseRange = {
  min: number;
  max: number;
};

/** Editable base ranges for the live quote generator. */
const PUBLIC_SHOWS: Record<Lineup, BaseRange> = {
  Duo: { min: 500, max: 1200 },
  "4-Piece": { min: 800, max: 2000 },
  "5-Piece": { min: 1000, max: 3000 },
  "7-Piece": { min: 1400, max: 4000 },
};

const PRIVATE_EVENTS: Record<Lineup, BaseRange> = {
  Duo: { min: 1000, max: 2000 },
  "4-Piece": { min: 1800, max: 2500 },
  "5-Piece": { min: 2200, max: 4000 },
  "7-Piece": { min: 3000, max: 5000 },
};

const FUNDRAISERS: Record<Lineup, BaseRange> = {
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

const LINEUPS: Lineup[] = ["Duo", "4-Piece", "5-Piece", "7-Piece"];
const RECOMMEND_LINEUP = "Not sure — recommend one";
const TWO_HOUR_SET_LENGTH = "≤ 2 hours";
const FOUR_HOUR_SET_LENGTH = "4 hours";

const isLineup = (value: BookingInput["lineup"]): value is Lineup =>
  value === "Duo" || value === "4-Piece" || value === "5-Piece" || value === "7-Piece";

const isLineupChoice = (value: BookingInput["lineup"]) =>
  isLineup(value) || value === RECOMMEND_LINEUP;

const isTwoHourSetLength = (value: BookingInput["setLength"]) =>
  value === TWO_HOUR_SET_LENGTH || value === "2 hours";

function eventBucket(eventType: BookingInput["eventType"]): EventBucket {
  if (eventType === "Wedding") return "wedding";
  if (eventType === "Fundraiser" || eventType === "Festival / Fundraiser") {
    return "fundraiser";
  }
  if (
    eventType === "Private / Corporate Event" ||
    eventType === "Private Party" ||
    eventType === "Corporate Event"
  ) {
    return "private";
  }
  return "public";
}

function baseRange(bucket: EventBucket, lineup: Lineup): BaseRange {
  if (bucket === "private") return PRIVATE_EVENTS[lineup];
  if (bucket === "wedding") return WEDDINGS[lineup];
  if (bucket === "fundraiser") return FUNDRAISERS[lineup];
  return PUBLIC_SHOWS[lineup];
}

function roundToNearest50(value: number) {
  return Math.round(value / 50) * 50;
}

function currency(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

function customLengthRange(range: BaseRange, hours: number): BaseRange {
  const spread = range.max - range.min;
  const extraHours = Math.max(hours - 4, 0);
  const fourHourMin = range.min + spread * 0.65;

  return {
    min: fourHourMin + range.max * extraHours * 0.08,
    max: range.max + range.max * extraHours * 0.14,
  };
}

function performanceRange(
  range: BaseRange,
  input: Partial<BookingInput>,
  customHours: number | undefined
): BaseRange {
  const setLength =
    input.repertoire === "Original Music" ? TWO_HOUR_SET_LENGTH : input.setLength;

  if (isTwoHourSetLength(setLength)) {
    return {
      min: range.min,
      max: range.max,
    };
  }

  if (setLength === "3 hours") {
    return {
      min: range.min + (range.max - range.min) * 0.35,
      max: range.max,
    };
  }

  if (setLength === FOUR_HOUR_SET_LENGTH || customHours === 4) {
    return customLengthRange(range, 4);
  }

  return range;
}

function adjustedLineupRange(
  bucket: EventBucket,
  lineup: Lineup,
  input: Partial<BookingInput>,
  customHours: number | undefined,
  audience: number
): BaseRange {
  let { min, max } = performanceRange(baseRange(bucket, lineup), input, customHours);

  if (Number.isFinite(audience) && audience >= 300) {
    const lift = audience >= 750 ? 1.18 : 1.1;
    min *= lift;
    max *= lift;
  }

  if (
    input.soundProvided === "Band provides sound" ||
    input.soundProvided === "Band provides PA / sound"
  ) {
    min *= 1.12;
    max *= 1.2;
  } else if (input.soundProvided === "Mix of Both" || input.soundProvided === "Unsure") {
    max *= 1.2;
  }

  if (input.formalDress) {
    min *= 1.06;
    max *= 1.1;
  }

  if (bucket === "fundraiser") {
    min *= 0.9;
    max *= 0.9;
  }

  return { min, max };
}

function estimateRange(
  bucket: EventBucket,
  input: Partial<BookingInput>,
  customHours: number | undefined,
  audience: number
): BaseRange {
  if (input.lineup === RECOMMEND_LINEUP) {
    const ranges = LINEUPS.map((lineup) =>
      adjustedLineupRange(bucket, lineup, input, customHours, audience)
    );

    return {
      min: Math.min(...ranges.map((range) => range.min)),
      max: Math.max(...ranges.map((range) => range.max)),
    };
  }

  const lineup = isLineup(input.lineup) ? input.lineup : "Duo";
  return adjustedLineupRange(bucket, lineup, input, customHours, audience);
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
  const bucket = eventBucket(input.eventType);
  const customHours =
    input.repertoire !== "Original Music" &&
    typeof input.customHours === "number" &&
    Number.isFinite(input.customHours)
      ? Math.min(input.customHours, 4)
      : undefined;
  const notes: string[] = [];

  if (input.repertoire === "Original Music") {
    notes.push(`Original-music sets are capped at ${TWO_HOUR_SET_LENGTH}.`);
  } else if (input.setLength === "3 hours") {
    notes.push("Most clients choose 3 hours.");
  }

  const audience = Number.parseInt(String(input.audienceSize ?? "").replace(/\D/g, ""), 10);
  if (Number.isFinite(audience) && audience >= 300) {
    notes.push("Large attendance can increase production needs.");
  }

  if (input.formalDress) {
    notes.push("Formal presentation requirements may carry an additional fee.");
  }

  const { min, max } = estimateRange(bucket, input, customHours, audience);

  const finalMin = roundToNearest50(min);
  const finalMax = Math.max(roundToNearest50(max), finalMin + 50);

  return {
    label: `${currency(finalMin)}-${currency(finalMax)}`,
    min: finalMin,
    max: finalMax,
    bucket,
    notes,
    ready: Boolean(
      input.eventType &&
        isLineupChoice(input.lineup) &&
        (input.repertoire === "Original Music" || input.setLength || customHours)
    ),
  };
}
