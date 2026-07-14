"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Disc3,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { SmartImage } from "./smart-image";
import { Badge } from "@/components/ui/badge";
import { RELEASES } from "@/lib/content";
import { STREAM_ICONS } from "./icons";
import { usePlayer } from "./player-provider";
import { cn } from "@/lib/utils";

function fmt(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function Music() {
  const [direction, setDirection] = useState(1);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const {
    release,
    releaseIndex: index,
    playing,
    currentTime,
    displayDuration,
    progress,
    toggle,
    restart,
    selectRelease,
    seekToRatio,
  } = usePlayer();

  const total = RELEASES.length;
  const platforms = useMemo(
    () =>
      release.platforms?.length
        ? release.platforms
        : release.appleMusicUrl
          ? [{ key: "appleMusic" as const, label: "Apple Music", url: release.appleMusicUrl }]
          : [],
    [release]
  );

  const go = (nextIndex: number) => {
    const normalizedIndex = (nextIndex + total) % total;
    setDirection(nextIndex > index ? 1 : -1);
    selectRelease(normalizedIndex);
  };

  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  useEffect(() => {
    const strip = thumbnailStripRef.current;
    const thumb = thumbnailRefs.current[index];
    if (!strip || !thumb || strip.scrollWidth <= strip.clientWidth) return;

    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [index]);

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!displayDuration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    seekToRatio((event.clientX - rect.left) / rect.width);
  };

  return (
    <Section id="music" eyebrow="Listen" title="Music">
      <Reveal>
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <div className="flex justify-center">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-foreground/45">
              {index + 1} / {total}
            </span>
          </div>

          <div className="relative px-0 sm:px-14">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous release"
              className="glass absolute left-0 top-[38%] z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full text-foreground/75 transition-colors hover:text-foreground sm:flex"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next release"
              className="glass absolute right-0 top-[38%] z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full text-foreground/75 transition-colors hover:text-foreground sm:flex"
            >
              <ChevronRight className="size-5" />
            </button>

            <div className="glass-raised overflow-hidden rounded-xl p-4 sm:p-5">
              <AnimatePresence initial={false} mode="wait" custom={direction}>
                <motion.div
                  key={release.title}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 36 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -36 }}
                  transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center"
                >
                  <SmartImage
                    src={release.cover}
                    alt={`${release.title} cover art`}
                    seed={index}
                    label={release.title}
                    className="aspect-square w-full max-w-[360px] rounded-[6px] object-cover shadow-[0_24px_70px_-35px_rgba(0,0,0,0.9)]"
                  />

                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <Badge className="gap-1.5 rounded-full bg-white/10 text-foreground">
                      <Disc3 className="size-3" />
                      {release.type}
                    </Badge>
                    {release.releaseDate && (
                      <Badge className="rounded-full bg-white/10 text-foreground/75">
                        {release.releaseDate}
                      </Badge>
                    )}
                    {release.trackCount && release.type !== "Single" && (
                      <Badge className="rounded-full bg-white/10 text-foreground/75">
                        {release.trackCount} {release.trackCount === 1 ? "track" : "tracks"}
                      </Badge>
                    )}
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    {release.title}
                  </h3>
                  <p className="mt-1 text-sm text-foreground/55">
                    {release.artist}
                    {release.genre ? ` · ${release.genre}` : ""}
                  </p>

                  <div className="mt-5 w-full max-w-lg rounded-xl border border-white/10 bg-black/25 p-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={toggle}
                        disabled={!release.previewUrl}
                        aria-label={playing ? "Pause preview" : "Play preview"}
                        className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-black transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {playing ? (
                          <Pause className="size-4 fill-current" />
                        ) : (
                          <Play className="size-4 translate-x-0.5 fill-current" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center justify-between gap-3">
                          <p className="truncate text-left text-sm font-semibold">
                            Preview
                          </p>
                          <span className="font-mono text-[10px] tabular-nums text-foreground/45">
                            {fmt(currentTime)} / {fmt(displayDuration)}
                          </span>
                        </div>
                        <div
                          onClick={seek}
                          className={cn(
                            "h-1.5 rounded-full bg-white/15",
                            displayDuration && "cursor-pointer"
                          )}
                        >
                          <div
                            className="h-full rounded-full bg-white transition-[width] duration-150"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={restart}
                        aria-label="Restart preview"
                        className="grid size-9 shrink-0 place-items-center rounded-full text-foreground/45 transition-colors hover:text-foreground"
                      >
                        <RotateCcw className="size-4" />
                      </button>
                    </div>

                    {release.previewUrl && (
                      <span className="sr-only">Preview available</span>
                    )}
                  </div>

                  <div className="mt-5 flex max-w-full flex-nowrap items-center justify-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {platforms.map((platform) => {
                      const Icon = STREAM_ICONS[platform.key];
                      return (
                        <a
                          key={`${release.title}-${platform.key}`}
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Listen to ${release.title} on ${platform.label}`}
                          title={platform.label}
                          className="glass inline-flex size-11 shrink-0 items-center justify-center rounded-full text-foreground/75 transition-all hover:scale-[1.04] hover:text-foreground"
                        >
                          <Icon className="size-4.5" />
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex justify-between sm:hidden">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous release"
                className="glass flex size-10 items-center justify-center rounded-full text-foreground/75 transition-colors hover:text-foreground"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next release"
                className="glass flex size-10 items-center justify-center rounded-full text-foreground/75 transition-colors hover:text-foreground"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          <div ref={thumbnailStripRef} className="overflow-x-auto pb-2 [scrollbar-width:thin]">
            <div className="mx-auto flex w-max min-w-full justify-center gap-2">
              {RELEASES.map((item, n) => (
                <button
                  key={item.title}
                  ref={(node) => {
                    thumbnailRefs.current[n] = node;
                  }}
                  type="button"
                  onClick={() => go(n)}
                  aria-label={`Show ${item.title}`}
                  className={cn(
                    "relative size-16 shrink-0 overflow-hidden rounded-md transition-all sm:size-[72px]",
                    n === index ? "ring-2 ring-white" : "opacity-55 hover:opacity-95"
                  )}
                >
                  <SmartImage
                    src={item.cover}
                    alt={`${item.title} thumbnail`}
                    seed={n}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
