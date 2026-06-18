import type { SVGProps } from "react";

/* Minimal brand glyphs (lucide lacks Spotify/Apple/TikTok). */

export function SpotifyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.5 17.32a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.57-1.04 8.5-.59 11.66 1.34.36.22.47.69.25 1.03zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.23-1.99-8.16-2.56-11.98-1.4a.94.94 0 1 1-.55-1.8c4.37-1.33 9.8-.69 13.51 1.6.44.27.58.85.31 1.29zm.13-3.4C15.8 8.34 8.98 8.12 5.2 9.27a1.13 1.13 0 1 1-.65-2.16c4.34-1.32 11.87-1.06 16.07 1.43a1.13 1.13 0 1 1-1.15 1.94z" />
    </svg>
  );
}

export function AppleMusicIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.5 3.2 9 4.8c-.6.13-1 .66-1 1.27v8.04A3.2 3.2 0 0 0 6 13.7a3.2 3.2 0 1 0 3.2 3.2V9.1l6-1.27v4.6a3.2 3.2 0 0 0-2-.4 3.2 3.2 0 1 0 3.5 3.18V4.47c0-.83-.78-1.45-1.2-1.27zM4 .9h16A3.1 3.1 0 0 1 23.1 4v16A3.1 3.1 0 0 1 20 23.1H4A3.1 3.1 0 0 1 .9 20V4A3.1 3.1 0 0 1 4 .9z" opacity="0" />
      <path d="M16.43 2.02 9.2 3.56c-.7.15-1.2.77-1.2 1.49v8.2a3.34 3.34 0 0 0-1.9-.6 3.35 3.35 0 1 0 3.35 3.35V9.02l5.95-1.27v3.9a3.34 3.34 0 0 0-1.9-.59 3.35 3.35 0 1 0 3.35 3.35V3.5c0-.96-.9-1.68-1.82-1.48z" />
    </svg>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.6 4 12 4 12 4s-7.6 0-9.4.4A3 3 0 0 0 .5 6.5C0 8.3 0 12 0 12s0 3.7.5 5.5a3 3 0 0 0 2.1 2.1C4.4 20 12 20 12 20s7.6 0 9.4-.4a3 3 0 0 0 2.1-2.1c.5-1.8.5-5.5.5-5.5s0-3.7-.5-5.5zM9.6 15.5v-7l6.3 3.5-6.3 3.5z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.16c3.2 0 3.58 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.16 15.58 2.16 15.2 2.16 12s0-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12z" />
    </svg>
  );
}

export function TiktokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1-2.82h-3.1v12.1a2.6 2.6 0 1 1-2.6-2.6c.27 0 .53.04.78.12v-3.2a5.85 5.85 0 0 0-.78-.05A5.8 5.8 0 1 0 15.7 15V9.01a7.3 7.3 0 0 0 4.3 1.39V7.3a4.28 4.28 0 0 1-3.4-1.48z" />
    </svg>
  );
}

export const SOCIAL_ICONS = {
  spotify: SpotifyIcon,
  appleMusic: AppleMusicIcon,
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TiktokIcon,
} as const;
