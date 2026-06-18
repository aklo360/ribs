/**
 * Single source of truth for Roots in Blue Stone site content.
 * Edit band info, bio, releases, members, and links here.
 */

export const SITE = {
  name: "Roots in Blue Stone",
  short: "RIBS",
  tagline: "Original Music. Real Vibe. Blue Stone Roots.",
  description:
    "Roots in Blue Stone is a Pennsylvania-born band blending reggae, rock, blues, and soul. From two-man looping sets to full festival shows, RIBS brings heart, rhythm, and authenticity to every stage.",
  // Update to the production domain once confirmed.
  url: "https://www.rootsinbluestone.com",
  bookingEmail: "booking@rootsinbluestone.com",
  genres: ["Reggae", "Rock", "Blues", "Soul"],
  homeBase: "Pennsylvania · The Poconos",
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

/** Lineup configurations the band can be booked as. */
export const LINEUPS = [
  {
    key: "duo",
    label: "Duo",
    blurb: "The original two-man looping set — guitar, percussion, and vocals layered live.",
  },
  {
    key: "trio",
    label: "Trio",
    blurb: "Adds low-end and depth for clubs and mid-size rooms.",
  },
  {
    key: "5-piece",
    label: "5-Piece",
    blurb: "Full rhythm section for festivals, breweries, and larger crowds.",
  },
  {
    key: "7-piece",
    label: "7-Piece",
    blurb: "Horns and extras for the biggest stages and headline sets.",
  },
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
    cover:
      "https://static.wixstatic.com/media/7464fb_e7f6f1cfd0a449029190c8c70aca7df8~mv2.png",
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

/** Photo gallery — existing press/live shots from the current site. */
export const GALLERY: string[] = [
  "https://static.wixstatic.com/media/7464fb_233811dcefb841ce9c4d3389711e99fb~mv2.jpg",
  "https://static.wixstatic.com/media/7464fb_48a57b5aba95432b82248ce95af55005~mv2.jpeg",
  "https://static.wixstatic.com/media/7464fb_e6fb15eb5497413cbbe59b4fe6c4967c~mv2.jpg",
  "https://static.wixstatic.com/media/7464fb_c94f30bb6b8d49dcb5a4a0c0f00661bf~mv2.jpeg",
  "https://static.wixstatic.com/media/7464fb_840e582c737f42cfaabff04fac6d9132~mv2.jpg",
  "https://static.wixstatic.com/media/7464fb_105e4c91d9e247c594176a4e1ee0b1c9~mv2.jpeg",
  "https://static.wixstatic.com/media/7464fb_cb086d1abf694a2a856f4155d17192b7~mv2.jpg",
  "https://static.wixstatic.com/media/7464fb_ef81adf8db2346fb84bedc1c316f0fc3~mv2.jpg",
];

/** Hero / press image used in the hero and About sections. */
export const HERO_IMAGE =
  "https://static.wixstatic.com/media/7464fb_88f5c099576043a7a14d234efdef29d2~mv2.jpg";

export const NAV_LINKS = [
  { label: "Tour", href: "#tour" },
  { label: "Music", href: "#music" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Video", href: "#video" },
] as const;
