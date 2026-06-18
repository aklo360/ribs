import { z } from "zod";

/**
 * Booking inquiry schema — everything a booking agent / talent buyer needs.
 * Used by both the client form and the /api/book route handler.
 */

export const INQUIRER_TYPES = [
  "Talent Buyer",
  "Venue / Promoter",
  "Private Event",
  "Wedding",
  "Corporate",
  "Festival",
  "Other",
] as const;

export const EVENT_TYPES = [
  "Festival",
  "Club / Bar",
  "Winery / Brewery",
  "Wedding",
  "Private Party",
  "Corporate Event",
  "Fair / Fundraiser",
  "Other",
] as const;

export const LINEUP_OPTIONS = [
  "Duo",
  "Trio",
  "5-Piece",
  "7-Piece",
  "Not sure — recommend one",
] as const;

export const REPERTOIRE_OPTIONS = ["Originals", "Covers", "Mix of both"] as const;

export const PROVIDED_OPTIONS = ["Provided", "Band to provide", "Unsure"] as const;

export const BACKLINE_ITEMS = [
  "Full PA / Sound System",
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
  eventType: z.enum(EVENT_TYPES).optional(),
  eventDate: z.string().optional(),
  dateFlexible: z.boolean().default(false),
  city: z.string().min(2, "Where is the event?"),
  region: z.string().optional(),
  venueName: z.string().optional(),
  setting: z.enum(["Indoor", "Outdoor", "Both / Unsure"]).optional(),
  audienceSize: z.string().optional(),

  // Performance
  lineup: z.enum(LINEUP_OPTIONS).optional(),
  setLength: z.string().optional(),
  repertoire: z.enum(REPERTOIRE_OPTIONS).optional(),

  // Technical / backline
  soundProvided: z.enum(PROVIDED_OPTIONS).optional(),
  soundEngineerNeeded: z.boolean().default(false),
  backline: z.array(z.string()).default([]),
  stageNotes: z.string().optional(),
  powerAvailable: z.boolean().default(false),

  // Logistics & budget
  budget: z.enum(BUDGET_RANGES).optional(),
  travelLodging: z.boolean().default(false),
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
  setLength: "",
  soundEngineerNeeded: false,
  backline: [],
  stageNotes: "",
  powerAvailable: false,
  travelLodging: false,
  message: "",
  company_website: "",
};
