/**
 * Single source of truth for Roots in Blue Stone site content.
 * Edit band info, bio, releases, members, and links here.
 */

export const SITE = {
  name: "Roots in Blue Stone",
  short: "RIBS",
  // From the band's site motto: "Original Music. Real Vibe. Blue Stone Roots."
  tagline: "Original Music. Real Vibe. Blue Stone Roots.",
  // Verbatim opening line of their bio.
  description:
    "Roots in Blue Stone is a Pennsylvania-born band blending reggae, rock, blues, and soul into a sound that feels both familiar and fresh.",
  // Update to the production domain once confirmed.
  url: "https://www.rootsinbluestone.com",
  bookingEmail: "booking@rootsinbluestone.com",
  genres: ["Reggae", "Rock", "Blues", "Soul"],
  homeBase: "Pennsylvania · The Poconos",
  logo: "/img/logo.png",
} as const;

export const BIO = [
  "Roots in Blue Stone is a Pennsylvania-born band blending reggae, rock, blues, and soul into a sound that feels both familiar and fresh. Built on the powerful chemistry between Walter Lee and Ian Kirk, the duo began as a live looping project — layering guitar, percussion, and vocals in real time — and grew into a dynamic act capable of filling any stage, from intimate wineries to packed festivals.",
  'Our music lives at the crossroads of roots and groove, inspired by artists like Bob Marley, Lynyrd Skynyrd, Sublime, and Joe Bonamassa, while grounded in the storytelling spirit of the Poconos and family. Whether performing original songs like "Carry On" and "No Pasta In The Hot Tub" or reimagining crowd favorites for weddings and private events, Roots in Blue Stone brings heart, rhythm, and authenticity to every performance.',
  "From full-band festival shows to two-man looping sets, we create live experiences that connect people — through groove, grit, and good vibes.",
] as const;

export type Member = {
  name: string;
  role: string;
};

export const MEMBERS: Member[] = [
  { name: "Walter Lee", role: "Vocals · Guitar · Co-Founder" },
  { name: "Ian Kirk", role: "Percussion · Vocals · Co-Founder" },
];

/** Lineup configurations the band can be booked as (labels only — no invented copy). */
export const LINEUPS = [
  { key: "duo", label: "Duo" },
  { key: "trio", label: "Trio" },
  { key: "5-piece", label: "5-Piece" },
  { key: "7-piece", label: "7-Piece" },
] as const;

export type Release = {
  title: string;
  type: "Single" | "EP" | "Album";
  status: string;
  cover: string;
  listenUrl: string;
  featured?: boolean;
};

export const RELEASES: Release[] = [
  {
    title: "One Last Breath",
    type: "Single",
    status: "Out Now",
    cover: "/img/one-last-breath.png",
    listenUrl: "https://artists.landr.com/057914992419",
    featured: true,
  },
];

/** Originals worth highlighting. */
export const ORIGINALS = ["Carry On", "No Pasta In The Hot Tub", "One Last Breath"];

export type SocialKey =
  | "spotify"
  | "appleMusic"
  | "youtube"
  | "instagram"
  | "facebook"
  | "tiktok";

export const SOCIALS: Record<
  SocialKey,
  { label: string; url: string }
> = {
  spotify: {
    label: "Spotify",
    url: "https://open.spotify.com/artist/1MmtWj3eNt02HjmdiQVY2q",
  },
  appleMusic: {
    label: "Apple Music",
    url: "https://music.apple.com/us/artist/roots-in-blue-stone/1654001797",
  },
  youtube: {
    label: "YouTube",
    url: "https://www.youtube.com/channel/UCgPcbcspzKlnl7sej13vPoA",
  },
  instagram: {
    label: "Instagram",
    url: "https://www.instagram.com/rootsinbluestone",
  },
  facebook: {
    label: "Facebook",
    url: "https://www.facebook.com/rootsinbluestone",
  },
  tiktok: {
    label: "TikTok",
    url: "https://www.tiktok.com/@rootsinbluestone",
  },
};

/** Spotify artist ID for the embedded player. */
export const SPOTIFY_ARTIST_ID = "1MmtWj3eNt02HjmdiQVY2q";

/** Photo gallery — real press/live shots scraped from the current site. */
export const GALLERY: string[] = [
  "/gallery/g1.jpg",
  "/gallery/g3.jpg",
  "/gallery/g5.jpg",
  "/gallery/g7.jpg",
  "/gallery/g2.jpg",
  "/gallery/g4.jpg",
  "/gallery/g6.jpg",
];

/** Hero / press image (real high-res band photo from the current site). */
export const HERO_IMAGE = "/img/hero-banner.jpg";

export const NAV_LINKS = [
  { label: "Tour", href: "#tour" },
  { label: "Music", href: "#music" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Video", href: "#video" },
] as const;
