import type { BookingInput } from "./booking-schema";

type EstimateItem = {
  label: string;
  amount: number;
};

export type QuoteEstimate = {
  low: number;
  high: number;
  items: EstimateItem[];
  needsReview: string[];
};

const BASE_BY_LINEUP: Record<string, number> = {
  Duo: 1200,
  Trio: 1800,
  "5-Piece": 3200,
  "7-Piece": 4500,
  "Not sure — recommend one": 2200,
};

const SET_LENGTH_ADJUSTMENTS: Record<string, number> = {
  "45 min": -250,
  "1 hour": -100,
  "2 × 45 min": 0,
  "2 × 60 min": 350,
  "3+ hours": 850,
  Flexible: 0,
};

const EVENT_ADJUSTMENTS: Record<string, number> = {
  Festival: 400,
  "Club / Bar": -150,
  "Winery / Brewery": 0,
  Wedding: 650,
  "Private Party": 250,
  "Corporate Event": 650,
  "Fair / Fundraiser": 150,
  Other: 0,
};

export function calculateQuoteEstimate(input: Partial<BookingInput>): QuoteEstimate {
  const items: EstimateItem[] = [];
  const needsReview: string[] = [];

  const lineup = input.lineup ?? "Not sure — recommend one";
  const base = BASE_BY_LINEUP[lineup] ?? BASE_BY_LINEUP["Not sure — recommend one"];
  items.push({ label: lineup, amount: base });

  if (input.setLength) {
    const amount = SET_LENGTH_ADJUSTMENTS[input.setLength] ?? 0;
    if (amount) items.push({ label: input.setLength, amount });
  }

  if (input.eventType) {
    const amount = EVENT_ADJUSTMENTS[input.eventType] ?? 0;
    if (amount) items.push({ label: input.eventType, amount });
  }

  if (input.setting === "Outdoor") {
    items.push({ label: "Outdoor setup", amount: 150 });
  }

  if (input.soundProvided === "Band to provide") {
    items.push({ label: "Band-provided PA", amount: 450 });
  } else if (input.soundProvided === "Unsure") {
    needsReview.push("Sound/PA needs confirmation");
  }

  if (input.soundEngineerNeeded) {
    items.push({ label: "Sound engineer", amount: 350 });
  }

  if (input.travelLodging) {
    needsReview.push("Travel/lodging supplied by client");
  } else if (input.city || input.region) {
    needsReview.push("Travel distance may affect final quote");
  }

  const subtotal = Math.max(
    750,
    items.reduce((sum, item) => sum + item.amount, 0)
  );

  return {
    low: roundToNearest(subtotal * 0.9, 50),
    high: roundToNearest(subtotal * 1.15, 50),
    items,
    needsReview,
  };
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatQuoteEstimate(estimate: QuoteEstimate): string {
  return `${formatMoney(estimate.low)}–${formatMoney(estimate.high)}`;
}

function roundToNearest(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest;
}
