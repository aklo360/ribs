/**
 * Single source of truth for Roots in Blue Stone site content.
 * Edit band info, bio, releases, members, and links here.
 */

export const SITE = {
  name: "Roots in Blue Stone",
  short: "RIBS",
  tagline: "Originals & Covers · Groove, Grit & Good Vibes",
  taglineLines: ["Originals & Covers", "Groove, Grit & Good Vibes"],
  // Verbatim opening line of their bio.
  description:
    "Roots in Blue Stone is a Pennsylvania-born band blending reggae, rock, blues, and soul into a sound that feels both familiar and fresh.",
  url: "https://rootsinbluestone.com",
  bookingEmail: "rootsinbluestone@gmail.com",
  genres: ["Reggae", "Rock", "Blues", "Soul"],
  homeBase: "Pennsylvania · The Poconos",
  logo: "/img/logo.png",
  // Their booking/EPK profile on Dusk (5.0★ across 11 reviews).
  dusk: "https://dusk.fm/@rootsinbluestone",
  duskRating: "5.0",
  duskReviews: 11,
  // Bandsintown artist page (follow / request a show).
  bandsintown: "https://www.bandsintown.com/a/15511983",
  // Public Mailchimp connected-site loader from the previous site. This is not
  // the newsletter submit path; custom signups still post through /api/newsletter.
  mailchimpConnectedSiteScript:
    "https://chimpstatic.com/mcjs-connected/js/users/5b4e3c0fcf331aa18189f0a1a/d183299d8405d9b5fa6454cdf.js",
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
  { name: "Walter Lee", role: "Vocals · Guitar · Percussion" },
  { name: "Ian Kirk", role: "Vocals · Lead Guitar" },
];

/** Lineup configurations the band can be booked as (labels only — no invented copy). */
export const LINEUPS = [
  { key: "duo", label: "Duo" },
  { key: "4-piece", label: "4 Piece" },
  { key: "5-piece", label: "5 Piece" },
  { key: "7-piece", label: "7 Piece" },
] as const;

export type Release = {
  title: string;
  type: "Single" | "EP" | "Album";
  status: string;
  cover: string;
  listenUrl: string;
  releaseDate?: string;
  genre?: string;
  trackCount?: number;
  /** Direct Spotify release link when the public smart link resolves to an album/single. */
  spotifyUrl?: string;
  /** Spotify track id — links to the full track. */
  spotifyTrackId?: string;
  /** Apple Music track link. */
  appleMusicUrl?: string;
  /** 30-second preview mp3 (from Spotify) for the custom inline player. */
  previewUrl?: string;
  artist?: string;
  featured?: boolean;
  platforms?: { key: StreamPlatform; label: string; url: string }[];
};

export const RELEASES: Release[] = [
  {
    title: "Break Down",
    type: "Single",
    status: "Out Now",
    artist: "Roots In Blue Stone",
    cover: "/img/releases/break-down.jpg",
    listenUrl: "https://artists.landr.com/991043489351",
    releaseDate: "May 15, 2026",
    genre: "Reggae",
    trackCount: 1,
    spotifyUrl: "https://open.spotify.com/album/5xWSR0v7f6xIItn0tVemTR",
    appleMusicUrl:
      "https://music.apple.com/us/album/break-down/1893378207?i=1893378208",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7f/40/aa/7f40aa55-151c-17a7-df73-e5578c47e335/mzaf_2258306462090876051.plus.aac.p.m4a",
    featured: true,
    platforms: [
      { key: "spotify", label: "Spotify", url: "https://open.spotify.com/album/5xWSR0v7f6xIItn0tVemTR" },
      {
        key: "appleMusic",
        label: "Apple Music",
        url: "https://music.apple.com/us/album/break-down/1893378207?i=1893378208",
      },
      {
        key: "youtubeMusic",
        label: "YouTube Music",
        url: "https://music.youtube.com/playlist?list=OLAK5uy_kWFPiOb5B78kuSUdp7h4CPQnFLAQ95qzA&src=Linkfire",
      },
      { key: "amazonMusic", label: "Amazon Music", url: "https://music.amazon.com/albums/B0GX7F3F3F" },
      { key: "deezer", label: "Deezer", url: "https://www.deezer.com/album/961317131" },
      { key: "tidal", label: "Tidal", url: "https://www.tidal.com/album/515846933" },
      {
        key: "pandora",
        label: "Pandora",
        url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Froots-in-blue-stone%2Fbreak-down%2FALKclgvxx5dZtxw",
      },
    ],
  },
  {
    title: "One Last Breath",
    type: "Single",
    status: "2026",
    artist: "Roots In Blue Stone",
    cover: "/img/releases/one-last-breath.jpg",
    listenUrl: "https://artists.landr.com/057914992419",
    releaseDate: "March 13, 2026",
    genre: "Reggae",
    trackCount: 1,
    appleMusicUrl:
      "https://music.apple.com/us/album/one-last-breath/1881358433?i=1881358434",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/79/4a/97/794a97c8-65fc-328f-1465-e94b70066aef/mzaf_9881931032731391950.plus.aac.p.m4a",
    platforms: [
      {
        key: "appleMusic",
        label: "Apple Music",
        url: "https://music.apple.com/us/album/one-last-breath/1881358433?i=1881358434",
      },
      {
        key: "spotify",
        label: "Spotify",
        url: "https://open.spotify.com/search/Roots%20In%20Blue%20Stone%20One%20Last%20Breath",
      },
    ],
  },
  {
    title: "Carry On",
    type: "Single",
    status: "2025",
    artist: "Roots In Blue Stone & Karen Meeks",
    cover: "/img/releases/carry-on.jpg",
    listenUrl: "https://music.apple.com/us/album/carry-on/1879619643?i=1879619644",
    releaseDate: "November 7, 2025",
    genre: "Blues-Rock",
    trackCount: 1,
    appleMusicUrl:
      "https://music.apple.com/us/album/carry-on/1879619643?i=1879619644",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bc/33/c9/bc33c9f5-21c2-14ff-3858-e2dba7ba6c63/mzaf_14956381374265267115.plus.aac.p.m4a",
    platforms: [
      {
        key: "appleMusic",
        label: "Apple Music",
        url: "https://music.apple.com/us/album/carry-on/1879619643?i=1879619644",
      },
      {
        key: "spotify",
        label: "Spotify",
        url: "https://open.spotify.com/search/Roots%20In%20Blue%20Stone%20Carry%20On%20Karen%20Meeks",
      },
    ],
  },
  {
    title: "No Pasta in the Hot Tub",
    type: "Single",
    status: "2024",
    artist: "Roots In Blue Stone",
    cover: "/img/releases/no-pasta.jpg",
    listenUrl:
      "https://music.apple.com/us/album/no-pasta-in-the-hot-tub/1879617113?i=1879617114",
    releaseDate: "May 3, 2024",
    genre: "Reggae",
    trackCount: 1,
    spotifyUrl: "https://open.spotify.com/album/7ETEDXLGwdV5B8AfAsopuh",
    appleMusicUrl:
      "https://music.apple.com/us/album/no-pasta-in-the-hot-tub/1879617113?i=1879617114",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e7/a9/64/e7a96442-84bb-0f41-1457-1edfa042099d/mzaf_636668177970828951.plus.aac.p.m4a",
    platforms: [
      { key: "spotify", label: "Spotify", url: "https://open.spotify.com/album/7ETEDXLGwdV5B8AfAsopuh" },
      {
        key: "appleMusic",
        label: "Apple Music",
        url: "https://music.apple.com/us/album/no-pasta-in-the-hot-tub/1879617113?i=1879617114",
      },
    ],
  },
  {
    title: "One Day",
    type: "Single",
    status: "2023",
    artist: "Roots In Blue Stone",
    cover: "/img/releases/one-day.jpg",
    listenUrl: "https://music.apple.com/us/album/one-day/1879618804?i=1879618806",
    releaseDate: "March 17, 2023",
    genre: "Reggae",
    trackCount: 1,
    spotifyUrl: "https://open.spotify.com/album/3Ca4RZYC9iLTVMA1AcdVwI",
    appleMusicUrl:
      "https://music.apple.com/us/album/one-day/1879618804?i=1879618806",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ce/89/c3/ce89c390-3c21-a13c-46be-9ca42ea22820/mzaf_1536731405768686779.plus.aac.p.m4a",
    platforms: [
      { key: "spotify", label: "Spotify", url: "https://open.spotify.com/album/3Ca4RZYC9iLTVMA1AcdVwI" },
      {
        key: "appleMusic",
        label: "Apple Music",
        url: "https://music.apple.com/us/album/one-day/1879618804?i=1879618806",
      },
    ],
  },
  {
    title: "Borrowed Time",
    type: "Single",
    status: "2023",
    artist: "Roots In Blue Stone",
    cover: "/img/releases/borrowed-time.jpg",
    listenUrl:
      "https://music.apple.com/us/album/borrowed-time/1879617331?i=1879617332",
    releaseDate: "February 10, 2023",
    genre: "Blues-Rock",
    trackCount: 1,
    appleMusicUrl:
      "https://music.apple.com/us/album/borrowed-time/1879617331?i=1879617332",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4c/e8/67/4ce86751-5857-962b-9970-4aa89474e6b5/mzaf_8454744426382212358.plus.aac.p.m4a",
    platforms: [
      {
        key: "appleMusic",
        label: "Apple Music",
        url: "https://music.apple.com/us/album/borrowed-time/1879617331?i=1879617332",
      },
      {
        key: "spotify",
        label: "Spotify",
        url: "https://open.spotify.com/search/Roots%20In%20Blue%20Stone%20Borrowed%20Time",
      },
    ],
  },
  {
    title: "Amaranthus",
    type: "Single",
    status: "2023",
    artist: "Roots In Blue Stone",
    cover: "/img/releases/amaranthus.jpg",
    listenUrl: "https://music.apple.com/us/album/amaranthus/1879625243?i=1879625244",
    releaseDate: "January 12, 2023",
    genre: "Contemporary Folk",
    trackCount: 1,
    spotifyUrl: "https://open.spotify.com/album/31LZHhbWmlvw65rKHsas5c",
    appleMusicUrl:
      "https://music.apple.com/us/album/amaranthus/1879625243?i=1879625244",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/78/d7/ff/78d7ff7e-a622-eede-dc3a-4bee47721e52/mzaf_6729430746823838564.plus.aac.p.m4a",
    platforms: [
      { key: "spotify", label: "Spotify", url: "https://open.spotify.com/album/31LZHhbWmlvw65rKHsas5c" },
      {
        key: "appleMusic",
        label: "Apple Music",
        url: "https://music.apple.com/us/album/amaranthus/1879625243?i=1879625244",
      },
    ],
  },
  {
    title: "Live At the Hall Castle Inn",
    type: "Album",
    status: "2022",
    artist: "Roots In Blue Stone",
    cover: "/img/releases/live-at-hall-castle-inn.jpg",
    listenUrl:
      "https://music.apple.com/us/album/live-at-the-hall-castle-inn/1654453556",
    releaseDate: "November 10, 2022",
    genre: "Folk",
    trackCount: 6,
    appleMusicUrl:
      "https://music.apple.com/us/album/live-at-the-hall-castle-inn/1654453556",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/76/b1/9f/76b19f44-5fc5-2479-b054-3c7ce62ed89b/mzaf_17621078082750025940.plus.aac.p.m4a",
    platforms: [
      {
        key: "appleMusic",
        label: "Apple Music",
        url: "https://music.apple.com/us/album/live-at-the-hall-castle-inn/1654453556",
      },
      {
        key: "spotify",
        label: "Spotify",
        url: "https://open.spotify.com/search/Roots%20In%20Blue%20Stone%20Live%20At%20The%20Hall%20Castle%20Inn",
      },
    ],
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
    url: "https://open.spotify.com/album/5xWSR0v7f6xIItn0tVemTR",
  },
  {
    key: "appleMusic",
    label: "Apple Music",
    url: "https://music.apple.com/us/album/break-down/1893378207?i=1893378208",
  },
  {
    key: "youtubeMusic",
    label: "YouTube Music",
    url: "https://music.youtube.com/playlist?list=OLAK5uy_kWFPiOb5B78kuSUdp7h4CPQnFLAQ95qzA&src=Linkfire",
  },
  {
    key: "amazonMusic",
    label: "Amazon Music",
    url: "https://music.amazon.com/albums/B0GX7F3F3F",
  },
  {
    key: "deezer",
    label: "Deezer",
    url: "https://www.deezer.com/album/961317131",
  },
  { key: "tidal", label: "Tidal", url: "https://www.tidal.com/album/515846933" },
  {
    key: "pandora",
    label: "Pandora",
    url: "https://pandora.app.link/?$desktop_url=https%3A%2F%2Fwww.pandora.com%2Fartist%2Froots-in-blue-stone%2Fbreak-down%2FALKclgvxx5dZtxw",
  },
];

/** Originals worth highlighting. */
export const ORIGINALS = ["Carry On", "No Pasta In The Hot Tub", "One Last Breath", "Break Down"];

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

/** Photo gallery — deduped real press/live shots from the site, Walter's Drive set, and downloaded RIBS photo zips. */
const BASE_GALLERY = [
  "/gallery/walter/w05.jpg",
  "/gallery/walter/w03.jpg",
  "/gallery/walter/w04.jpg",
  "/gallery/walter/w13.jpg",
  "/gallery/walter/w06.jpg",
  "/gallery/walter/w12.jpg",
  "/gallery/walter/w11.jpg",
  "/gallery/walter/w10.jpg",
  "/gallery/g09.jpg",
  "/gallery/walter/w08.jpg",
  "/gallery/walter/w07.jpg",
  "/gallery/walter/w09.jpg",
  "/gallery/g13.jpg",
  "/gallery/walter/w01.jpg",
  "/gallery/g15.jpg",
  "/gallery/g16.jpg",
  "/gallery/g17.jpg",
  "/gallery/g18.jpg",
  "/gallery/walter/w02.jpg",
] as const;

const ZIP_GALLERY_EXCLUSIONS = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 10, 20, 23, 26, 37, 38, 39, 40, 41, 42, 43, 44,
  60, 61, 62, 67, 69, 70, 71, 72, 74, 75, 76, 77, 78, 79, 80, 81, 82,
]);

export const GALLERY: string[] = [
  ...BASE_GALLERY,
  ...Array.from(
    { length: 84 },
    (_, i) => `/gallery/zips/ribs-zip-${String(i + 1).padStart(3, "0")}.jpg`
  ).filter((path) => {
    const number = Number(path.match(/ribs-zip-(\d+)\.jpg$/)?.[1]);
    return !ZIP_GALLERY_EXCLUSIONS.has(number);
  }),
];

/** Primary duo portrait used in the About section. */
export const ABOUT_IMAGE = "/gallery/g09.jpg";

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
