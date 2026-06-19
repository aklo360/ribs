"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, Pause, X } from "lucide-react";
import { SmartImage } from "./smart-image";
import { SpotifyIcon, AppleMusicIcon } from "./icons";
import { RELEASES, spotifyTrackUrl } from "@/lib/content";

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
  const release = RELEASES.find((r) => r.featured) ?? RELEASES[0];
  const audioRef = useRef<HTMLAudioElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCur(a.currentTime);
    const onMeta = () => setDur(a.duration || 0);
    const onEnd = () => {
      setPlaying(false);
      setCur(0);
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  if (!release?.previewUrl) return null;

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !dur) return;
    const rect = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - rect.left) / rect.width) * dur;
  };

  const pct = dur ? (cur / dur) * 100 : 0;
  const show = !dismissed;

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
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] tabular-nums text-foreground/45">
                  {fmt(cur)}
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-1 sm:flex">
              {release.spotifyTrackId && (
                <a
                  href={spotifyTrackUrl(release.spotifyTrackId)}
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
              onClick={() => {
                audioRef.current?.pause();
                setPlaying(false);
                setDismissed(true);
              }}
              aria-label="Dismiss player"
              className="grid size-8 shrink-0 place-items-center rounded-full text-foreground/40 transition-colors hover:text-foreground/80"
            >
              <X className="size-4" />
            </button>
          </div>

          <audio ref={audioRef} src={release.previewUrl} preload="none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
