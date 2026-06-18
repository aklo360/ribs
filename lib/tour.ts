/**
 * Tour dates. Edit this list to add/remove shows.
 * The current Wix site has no populated tour list, so this is seeded with the
 * one known upcoming show. Set status to "soldout" / "cancelled" as needed.
 */

export type ShowStatus = "onsale" | "soldout" | "free" | "announced" | "cancelled";

export type Show = {
  /** ISO date, e.g. "2026-04-10" */
  date: string;
  venue: string;
  city: string;
  region?: string;
  lineup?: string;
  ticketUrl?: string;
  status?: ShowStatus;
  note?: string;
};

export const SHOWS: Show[] = [
  // Real show carried over from the current site (kept for history; it is in the
  // past, so it is filtered out of the upcoming list automatically).
  {
    date: "2026-04-10",
    venue: "The Sherman Theater",
    city: "Stroudsburg",
    region: "PA",
    lineup: "Full Band",
    status: "onsale",
    note: "Sherman Showcase",
    ticketUrl:
      "https://www.etix.com/ticket/p/85429322/roots-in-blue-stone-stroudsburg-sherman-showcase?partner_id=5591&utm_source=Showcase&utm_medium=Headliner&utm_campaign=RootsInBlueStone26",
  },

  // ⚠️ PLACEHOLDER DATES — replace with real shows before launch.
  // These exist only so the Tour section demonstrates its design. They use
  // status "announced" (no ticket links) so nothing fake is presented as on-sale.
  {
    date: "2026-07-18",
    venue: "Mauch Chunk Opera House",
    city: "Jim Thorpe",
    region: "PA",
    lineup: "Full Band",
    status: "announced",
  },
  {
    date: "2026-08-09",
    venue: "Stone & Hammer Brewing",
    city: "Lake Harmony",
    region: "PA",
    lineup: "5-Piece",
    status: "announced",
  },
  {
    date: "2026-09-05",
    venue: "Pocono Roots Festival",
    city: "Stroudsburg",
    region: "PA",
    lineup: "7-Piece",
    status: "announced",
  },
];

/** Shows today or later, sorted soonest-first. */
export function upcomingShows(now: Date = new Date()): Show[] {
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  return SHOWS.filter((s) => new Date(s.date).getTime() >= startOfToday).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
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
