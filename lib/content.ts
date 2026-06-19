/**
 * Single source of truth for Roots in Blue Stone site content.
 * Edit band info, bio, releases, members, and links here.
 */

export const SITE = {
  name: "Roots in Blue Stone",
  short: "RIBS",
  tagline: "Originals & Covers. Groove, Grit & Good Vibes.",
  taglineLines: ["Originals & Covers.", "Groove, Grit & Good Vibes."],
  // Verbatim opening line of their bio.
  description:
    "Roots in Blue Stone is a Pennsylvania-born band blending reggae, rock, blues, and soul into a sound that feels both familiar and fresh.",
  // Update to the production domain once confirmed.
  url: "https://www.rootsinbluestone.com",
  bookingEmail: "booking@rootsinbluestone.com",
  genres: ["Reggae", "Rock", "Blues", "Soul"],
  homeBase: "Pennsylvania · The Poconos",
  logo: "/img/logo.png",
  // Their booking/EPK profile on Dusk (5.0★ across 11 reviews).
  dusk: "https://dusk.fm/@rootsinbluestone",
  duskRating: "5.0",
  duskReviews: 11,
} as const;

export const BIO = [
  "Roots in Blue Stone is a Pennsylvania-born band blending reggae, rock, blues, and soul into a sound that feels both familiar and fresh. Built on the powerful chemistry between Walter Lee and Ian Kirk, the duo began as a live looping project, layering guitar, percussion, and vocals in real time, and grew into a dynamic act capable of filling any stage, from intimate wineries to packed festivals.",
`Our music lives at the crossroads of blues rock and groove, inspired by artists like Bob Marley, Lynyrd Skynyrd, Sublime and Joe Bonamassa, while grounded in the roots of Walter & Ian’s hometown in the Poconos. Whether performing original songs like "Carry On" and "No Pasta In The Hot Tub" or reimagining crowd favorites such as a reggae version of Creed’s “One Last Breath” for weddings and private events, Roots in Blue Stone brings heart, rhythm, and authenticity to every performance.`,
  "From full-band festival shows to two-man looping sets, we create live experiences that connect people through groove, grit, and good vibes.",
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
  /** Spotify track id — links to the full track. */
  spotifyTrackId?: string;
  /** Apple Music track link. */
  appleMusicUrl?: string;
  /** 30-second preview mp3 (from Spotify) for the custom inline player. */
  previewUrl?: string;
  artist?: string;
  featured?: boolean;
};

export const RELEASES: Release[] = [
  {
    title: "One Last Breath",
    type: "Single",
    status: "Out Now",
    artist: "Roots In Blue Stone",
    cover: "/img/one-last-breath.jpg",
    listenUrl: "https://artists.landr.com/057914992419",
    appleMusicUrl:
      "https://music.apple.com/us/album/one-last-breath/1881358433?i=1881358434",
    spotifyTrackId: "2bLFDKSspU5NvQ4EwDxrA1",
    previewUrl:
      "https://p.scdn.co/mp3-preview/5bddbe3783e6a759a557e6dacff417a1713f1350",
    featured: true,
  },
];

export const spotifyTrackUrl = (id: string) =>
  `https://open.spotify.com/track/${id}`;

/** Per-platform links for the featured release (from its LANDR smart link). */
export type StreamPlatform =
  | "spotify"
  | "appleMusic"
  | "youtubeMusic"
  | "amazonMusic"
  | "deezer"
  | "tidal"
  | "pandora";

export const STREAMING: { key: StreamPlatform; label: string; url: string }[] = [
  {
    key: "spotify",
    label: "Spotify",
    url: "https://open.spotify.com/track/2bLFDKSspU5NvQ4EwDxrA1",
  },
  {
    key: "appleMusic",
    label: "Apple Music",
    url: "https://music.apple.com/us/album/1881358433?app=music&at=1l3vpUI&ct=LFV_ca8a6b4e0a4f3cb0bcf22c9be995105c&itscg=30440&itsct=catchall_p1&lId=215316995&cId=none&sr=1&src=Linkfire&ls=1",
  },
  {
    key: "youtubeMusic",
    label: "YouTube Music",
    url: "https://music.youtube.com/playlist?list=OLAK5uy_nXvtc9nB3qsGMsw_L3hzDr7cihtA5kfPI&src=Linkfire",
  },
  {
    key: "amazonMusic",
    label: "Amazon Music",
    url: "https://music.amazon.com/albums/B0GQQY678L?tag=linkfiregen&ie=UTF8&linkCode=as2&ascsubtag=ca8a6b4e0a4f3cb0bcf22c9be995105c",
  },
  {
    key: "deezer",
    label: "Deezer",
    url: "https://www.deezer.com/album/930108651?app_id=140685&utm_source=partner_linkfire",
  },
  { key: "tidal", label: "Tidal", url: "http://www.tidal.com/album/503352364" },
  {
    key: "pandora",
    label: "Pandora",
    url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Froots-in-blue-stone%2F1-last-breath%2FALn4khbmmkwjbJ9",
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

/** Photo gallery — real hi-res press/live shots from the current site. */
export const GALLERY: string[] = Array.from(
  { length: 14 },
  (_, i) => `/gallery/g${String(i + 1).padStart(2, "0")}.jpg`
);

/** YouTube uploads playlist (UC… channel id with the UC swapped for UU). */
export const YOUTUBE_UPLOADS_PLAYLIST = "UUgPcbcspzKlnl7sej13vPoA";

export type Video = { id: string; title: string };

/** Channel videos (real, from the YouTube RSS feed — titles lightly tidied). */
export const VIDEOS: Video[] = [
  { id: "_YQveNfpLgA", title: "Carry On — Official Music Video" },
  { id: "79iN67QAbtk", title: "No Pasta In The Hot Tub — Official Music Video" },
  { id: "fO4oHt51kio", title: "One Last Breath (Reggae Version) — Creed Cover" },
  { id: "CbB13t9Zw14", title: "Santa Claus Is Coming To Town — Official Music Video" },
  { id: "9dHxvtCUPGU", title: "Amaranthus — Live at The Renegade Winery" },
  { id: "Lw8dyokq8ZI", title: "Borrowed Time — Live at The Renegade Winery" },
  { id: "KhouOpHtcE0", title: "No Pasta In The Hot Tub — Live at The Renegade Winery" },
  { id: "yOAhtRpSeYc", title: "2am — Slightly Stoopid (Live @ PENN2)" },
  { id: "OZmN5ju-9O0", title: "You Are The Best Thing — Ray LaMontagne (Live @ PENN2)" },
  { id: "5UkojcYwlQ4", title: "Sweet Dreams — Eurythmics (Live @ Ladder 15)" },
  { id: "EPcJynQmFpo", title: "Kryptonite — Full Band" },
  { id: "RAtJ6kpjbI8", title: "Don’t Push — Sublime (Full Band)" },
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
