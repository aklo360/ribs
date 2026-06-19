/**
 * Tour dates — real shows from the band's Bandsintown (artist 15511983).
 * Update by editing this list; "Notify Me" / RSVP links point to each
 * Bandsintown event page.
 */

export type ShowStatus = "onsale" | "soldout" | "free" | "announced" | "cancelled";

export type Show = {
  /** ISO start date, e.g. "2026-06-21" */
  date: string;
  /** ISO end date for multi-day events */
  endDate?: string;
  venue: string;
  city: string;
  region?: string;
  lineup?: string;
  ticketUrl?: string;
  status?: ShowStatus;
  note?: string;
};

const E = (id: string) => `https://www.bandsintown.com/e/${id}`;

export const SHOWS: Show[] = [
  { date: "2026-06-21", venue: "National Go Skate Day", city: "Williamsburg", region: "NY", status: "onsale", ticketUrl: E("108104578") },
  { date: "2026-06-27", endDate: "2026-06-28", venue: "Finola's", city: "Stroudsburg", region: "PA", status: "onsale", ticketUrl: E("107999186") },
  { date: "2026-06-28", venue: "The Sandbox", city: "Highlands", region: "NJ", status: "onsale", ticketUrl: E("107919896") },
  { date: "2026-07-04", venue: "Ladder 15", city: "Philadelphia", region: "PA", status: "onsale", ticketUrl: E("107999203") },
  { date: "2026-07-10", venue: "The Sandbox", city: "Highlands", region: "NJ", status: "onsale", ticketUrl: E("107919898") },
  { date: "2026-07-18", venue: "One Earth", city: "Bethlehem", region: "PA", lineup: "Acoustic", status: "onsale", ticketUrl: E("107999221") },
  { date: "2026-07-25", venue: "Jam Below The Dam", city: "White Haven", region: "PA", status: "onsale", ticketUrl: E("107919906") },
  { date: "2026-08-01", endDate: "2026-08-02", venue: "Finola's", city: "Stroudsburg", region: "PA", status: "onsale", ticketUrl: E("107999237") },
  { date: "2026-08-14", venue: "The Sandbox", city: "Highlands", region: "NJ", status: "onsale", ticketUrl: E("107919910") },
  { date: "2026-08-15", venue: "Jubilee", city: "Pocono Pines", region: "PA", status: "onsale", ticketUrl: E("107481646") },
  { date: "2026-08-29", venue: "Edgewater", city: "Sea Bright", region: "NJ", note: "RIBS & The Rub", status: "onsale", ticketUrl: E("108104562") },
  { date: "2026-09-04", venue: "Warrior Bar & Grill", city: "Stroudsburg", region: "PA", status: "onsale", ticketUrl: E("107806622") },
  { date: "2026-09-26", endDate: "2026-09-27", venue: "Finola's", city: "Stroudsburg", region: "PA", status: "onsale", ticketUrl: E("107999247") },
  { date: "2026-11-14", venue: "Jubilee", city: "Pocono Pines", region: "PA", status: "onsale", ticketUrl: E("107481648") },
  { date: "2026-12-19", venue: "Ladder 15", city: "Philadelphia", region: "PA", status: "onsale", ticketUrl: E("107919913") },
];

/** Shows today or later, sorted soonest-first. */
export function upcomingShows(now: Date = new Date()): Show[] {
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  return SHOWS.filter(
    (s) => new Date(`${s.endDate ?? s.date}T12:00:00`).getTime() >= startOfToday
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function formatShowDate(iso: string): {
  month: string;
  day: string;
  weekday: string;
  year: string;
} {
  const d = new Date(`${iso}T12:00:00`);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.toLocaleDateString("en-US", { day: "numeric" }),
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    year: d.toLocaleDateString("en-US", { year: "numeric" }),
  };
}
