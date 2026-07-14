import { z } from "zod";

/**
 * Booking inquiry schema — everything a booking agent / talent buyer needs.
 * Used by both the client form and the /api/book route handler.
 */

export const INQUIRER_TYPES = [
  "Venue / Promoter",
  "Event Planner",
  "Private Host",
  "Other",
] as const;

export const EVENT_TYPES = [
  "Public Event",
  "Private / Corporate Event",
  "Wedding",
  "Fundraiser",
  "Other",
] as const;

const LEGACY_EVENT_TYPES = [
  "Bar / Restaurant",
  "Winery / Brewery",
  "Private Party",
  "Corporate Event",
  "Festival / Fundraiser",
] as const;

const BOOKING_EVENT_TYPES = [...EVENT_TYPES, ...LEGACY_EVENT_TYPES] as const;

export const LINEUP_OPTIONS = [
  "Duo",
  "4-Piece",
  "5-Piece",
  "7-Piece",
  "Not sure — recommend one",
] as const;

export const REPERTOIRE_OPTIONS = ["Original Music", "Covers", "Mix of both"] as const;

export const TWO_HOUR_SET_LENGTH = "≤ 2 hours";
const LEGACY_TWO_HOUR_SET_LENGTH = "2 hours";
const THREE_HOUR_SET_LENGTH = "3 hours";
export const FOUR_HOUR_SET_LENGTH = "4 hours";

export const SET_LENGTH_OPTIONS = [
  TWO_HOUR_SET_LENGTH,
  THREE_HOUR_SET_LENGTH,
  FOUR_HOUR_SET_LENGTH,
] as const;
const LEGACY_SET_LENGTH_OPTIONS = [LEGACY_TWO_HOUR_SET_LENGTH] as const;
const BOOKING_SET_LENGTH_OPTIONS = [...SET_LENGTH_OPTIONS, ...LEGACY_SET_LENGTH_OPTIONS] as const;

export const PROVIDED_OPTIONS = [
  "Venue provides sound",
  "Band provides sound",
  "Mix of Both",
] as const;
const LEGACY_PROVIDED_OPTIONS = ["Band provides PA / sound", "Unsure"] as const;
const BOOKING_PROVIDED_OPTIONS = [...PROVIDED_OPTIONS, ...LEGACY_PROVIDED_OPTIONS] as const;

export const BACKLINE_ITEMS = [
  "Will provide via email",
  "Full PA / Sound System",
  "Partial PA / Sound System",
  "Stage Monitors",
  "Drum Kit",
  "Bass Amp",
  "Guitar Amps",
  "Keyboard / Stand",
  "Microphones",
  "DI Boxes",
  "Lighting",
] as const;

export const BUDGET_RANGES = [
  "Under $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Flexible / Let's talk",
] as const;

export const HEARD_OPTIONS = [
  "Saw them live",
  "Spotify / Streaming",
  "Social media",
  "Referral",
  "Search",
  "Other",
] as const;

export const bookingSchema = z.object({
  // Contact
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  inquirerType: z.enum(INQUIRER_TYPES).optional(),

  // Event
  eventType: z.enum(BOOKING_EVENT_TYPES).optional(),
  eventDate: z.string().optional(),
  dateFlexible: z.boolean().default(false),
  city: z.string().min(2, "Where is the event?"),
  region: z.string().min(2, "What state or region is the event in?"),
  venueName: z.string().optional(),
  setting: z.enum(["Indoor", "Outdoor", "Both / Unsure"]).optional(),
  audienceSize: z.string().optional(),

  // Performance
  lineup: z.enum(LINEUP_OPTIONS).optional(),
  setLength: z.enum(BOOKING_SET_LENGTH_OPTIONS).optional(),
  customHours: z.preprocess(
    (value) => {
      if (value === "" || value === undefined || value === null) return undefined;
      const number = Number(value);
      return Number.isNaN(number) ? value : number;
    },
    z
      .number()
      .int("Enter a whole number of hours")
      .min(4, "4 hours is the maximum set length")
      .max(4, "4 hours is the maximum set length")
      .optional()
  ),
  repertoire: z.enum(REPERTOIRE_OPTIONS).optional(),

  // Technical / backline
  soundProvided: z.enum(BOOKING_PROVIDED_OPTIONS).optional(),
  backline: z.array(z.string()).default([]),
  stageNotes: z.string().optional(),
  powerAvailable: z.boolean().default(false),
  overheadCoverage: z.boolean().default(false),

  // Logistics & budget
  budget: z.enum(BUDGET_RANGES).optional(),
  travelLodging: z.boolean().default(false),
  formalDress: z.boolean().default(false),
  message: z.string().optional(),
  heardFrom: z.enum(HEARD_OPTIONS).optional(),

  // Honeypot (anti-spam — must stay empty)
  company_website: z.string().max(0).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const bookingDefaults: Partial<BookingInput> = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  dateFlexible: false,
  city: "",
  region: "",
  venueName: "",
  audienceSize: "",
  backline: [],
  stageNotes: "",
  powerAvailable: false,
  overheadCoverage: false,
  travelLodging: false,
  formalDress: false,
  message: "",
  company_website: "",
};
