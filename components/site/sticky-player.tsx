"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, Pause, X } from "lucide-react";
import { SmartImage } from "./smart-image";
import { SpotifyIcon, AppleMusicIcon } from "./icons";
import { spotifyTrackUrl } from "@/lib/content";
import { usePlayer } from "./player-provider";

function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/**
 * Slim monochrome player that slides up once you scroll past the hero and
 * follows you down the page. Plays the track's 30s preview.
 */
export function StickyPlayer() {
  const {
    release,
    playing,
    currentTime,
    progress,
    dismissed,
    toggle,
    dismiss,
    seekToRatio,
  } = usePlayer();
  const [scrolled, setScrolled] = useState(false);
  const [musicVisible, setMusicVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const music = document.getElementById("music");
    if (!music) return;

    const observer = new IntersectionObserver(
      ([entry]) => setMusicVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );

    observer.observe(music);
    return () => observer.disconnect();
  }, []);

  if (!release?.previewUrl) return null;

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seekToRatio((e.clientX - rect.left) / rect.width);
  };
  // Hidden at the very top; slides in as soon as you scroll. Stays once playing.
  const show = (scrolled || playing) && !dismissed && !musicVisible;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-5 sm:pb-4"
        >
          <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-xl bg-black/70 p-2.5 pr-3 shadow-[0_-10px_44px_-12px_rgba(0,0,0,0.85)] ring-1 ring-white/12 backdrop-blur-2xl">
            <SmartImage
              src={release.cover}
              alt={`${release.title} cover`}
              seed={1}
              className="size-11 shrink-0 rounded-md object-cover"
            />

            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause preview" : "Play preview"}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-black transition-transform hover:scale-105"
            >
              {playing ? (
                <Pause className="size-4 fill-current" />
              ) : (
                <Play className="size-4 translate-x-0.5 fill-current" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <p className="truncate text-sm font-semibold">{release.title}</p>
                <span className="hidden truncate text-xs text-foreground/50 sm:inline">
                  {release.artist}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div
                  onClick={seek}
                  className="h-1 flex-1 cursor-pointer rounded-full bg-white/15"
                >
                  <div
                    className="h-full rounded-full bg-white transition-[width] duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] tabular-nums text-foreground/45">
                  {fmt(currentTime)}
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-1 sm:flex">
              {(release.spotifyUrl || release.spotifyTrackId) && (
                <a
                  href={
                    release.spotifyUrl ??
                    (release.spotifyTrackId ? spotifyTrackUrl(release.spotifyTrackId) : "#")
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open in Spotify"
                  title="Open in Spotify"
                  className="flex size-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:text-foreground"
                >
                  <SpotifyIcon className="size-4" />
                </a>
              )}
              {release.appleMusicUrl && (
                <a
                  href={release.appleMusicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open in Apple Music"
                  title="Open in Apple Music"
                  className="flex size-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:text-foreground"
                >
                  <AppleMusicIcon className="size-4" />
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss player"
              className="grid size-8 shrink-0 place-items-center rounded-full text-foreground/40 transition-colors hover:text-foreground/80"
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
