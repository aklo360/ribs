/**
 * Tour dates copied/synced from the band's Bandsintown listings. The website
 * still renders from this checked-in list so changes stay reviewable.
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
  priceLabel?: string;
  note?: string;
};

const E = (id: string) => `https://www.bandsintown.com/e/${id}`;

export const SHOWS: Show[] = [
  { date: "2026-07-10", venue: "The Sandbox", city: "Highlands", region: "NJ", status: "onsale", priceLabel: "Free", ticketUrl: E("107919898") },
  { date: "2026-07-11", venue: "ArtsQuest", city: "Bethlehem", region: "PA", lineup: "Acoustic", status: "onsale", priceLabel: "Free", ticketUrl: E("107999221") },
  { date: "2026-07-24", venue: "Stage House Tavern", city: "Somerset", region: "NJ", status: "onsale", priceLabel: "Free", ticketUrl: E("108561883") },
  { date: "2026-07-25", venue: "White Haven", city: "White Haven", region: "PA", note: "Jam Below The Dam", status: "onsale", priceLabel: "Free", ticketUrl: E("107919906") },
  { date: "2026-07-26", venue: "Mountain View Vineyard, Winery & Brewery", city: "Stroudsburg", region: "PA", status: "onsale", priceLabel: "$20", ticketUrl: E("108561891") },
  { date: "2026-08-01", venue: "Finola's Irish Pub", city: "Stroudsburg", region: "PA", status: "onsale", priceLabel: "Free", ticketUrl: E("107999237") },
  { date: "2026-08-14", venue: "The Sandbox", city: "Highlands", region: "NJ", status: "onsale", priceLabel: "Free", ticketUrl: E("107919910") },
  { date: "2026-08-15", venue: "Jubilee Restaurant", city: "Pocono Pines", region: "PA", status: "onsale", priceLabel: "Free", ticketUrl: E("107481646") },
  { date: "2026-08-29", venue: "Edgewater Beach & Cabana Club", city: "Sea Bright", region: "NJ", note: "RIBS & The Rub", status: "onsale", priceLabel: "Free", ticketUrl: E("108104562") },
  { date: "2026-09-04", venue: "The Warrior Grill", city: "Stroudsburg", region: "PA", status: "onsale", priceLabel: "Free", ticketUrl: E("107806622") },
  { date: "2026-09-05", venue: "Stroudsburg Courthouse Square", city: "Stroudsburg", region: "PA", note: "Stroudfest", status: "onsale", priceLabel: "Free", ticketUrl: E("108561906") },
  { date: "2026-09-25", venue: "Signature Brewery & Saloon", city: "Stroudsburg", region: "PA", note: "RIBS & The Rub", status: "onsale", priceLabel: "Free", ticketUrl: E("108561924") },
  { date: "2026-09-26", venue: "Finola's Irish Pub", city: "Stroudsburg", region: "PA", status: "onsale", priceLabel: "Free", ticketUrl: E("107999247") },
  { date: "2026-11-14", venue: "Jubilee Restaurant", city: "Pocono Pines", region: "PA", status: "onsale", priceLabel: "Free", ticketUrl: E("107481648") },
  { date: "2026-12-19", venue: "Ladder 15", city: "Philadelphia", region: "PA", status: "onsale", priceLabel: "Free", ticketUrl: E("107919913") },
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
