"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { SmartImage } from "./smart-image";
import { SpotifyIcon } from "./icons";
import { spotifyTrackUrl, type Release } from "@/lib/content";

function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/** Minimal monochrome inline player — plays the track's 30s preview. */
export function ReleasePlayer({ release }: { release: Release }) {
  const audioRef = useRef<HTMLAudioElement>(null);
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

  return (
    <div className="w-full max-w-[336px]">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className="size-1.5 rounded-full bg-foreground/70" />
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-foreground/55">
          Latest Release
        </span>
      </div>

      <div className="flex items-center gap-4 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/10 backdrop-blur-xl">
        <SmartImage
          src={release.cover}
          alt={`${release.title} cover`}
          seed={1}
          className="size-[68px] shrink-0 rounded-md object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-bold leading-tight tracking-tight">
            {release.title}
          </p>
          <p className="truncate text-xs text-foreground/55">{release.artist}</p>

          {/* progress */}
          <div className="mt-2.5 flex items-center gap-2">
            <div
              onClick={seek}
              className="group h-1 flex-1 cursor-pointer rounded-full bg-white/15"
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

        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause preview" : "Play preview"}
          className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-black transition-transform hover:scale-105"
        >
          {playing ? (
            <Pause className="size-5 fill-current" />
          ) : (
            <Play className="size-5 translate-x-0.5 fill-current" />
          )}
        </button>
      </div>

      <div className="mt-2.5 flex items-center justify-between px-1">
        <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/35">
          30s preview
        </span>
        {release.spotifyTrackId && (
          <a
            href={spotifyTrackUrl(release.spotifyTrackId)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-foreground/55 transition-colors hover:text-foreground"
          >
            <SpotifyIcon className="size-3.5" />
            Listen on Spotify
          </a>
        )}
      </div>

      {release.previewUrl && (
        <audio ref={audioRef} src={release.previewUrl} preload="none" />
      )}
    </div>
  );
}
