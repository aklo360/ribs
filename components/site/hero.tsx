"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CalendarDays, Pause, Play, RotateCcw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartImage } from "./smart-image";
import { SocialLinks } from "./social-links";
import { TiltCard } from "./tilt-card";
import { AudioWaveform } from "./audio-waveform";
import { SITE, HERO_IMAGE } from "@/lib/content";
import { usePlayer } from "./player-provider";

function fmt(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function Hero() {
  const [flipped, setFlipped] = useState(false);
  const {
    release: latest,
    playing,
    currentTime,
    displayDuration,
    progress,
    play,
    toggle,
    seekToRatio,
  } = usePlayer();

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    seekToRatio((event.clientX - rect.left) / rect.width);
  };

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Background photo (grayscale) + overlays */}
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={HERO_IMAGE}
          alt="Roots in Blue Stone performing live on stage"
          className="mono h-full w-full object-cover object-[60%_center] opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/55 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pt-28 pb-16 sm:px-8 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center lg:text-left"
        >
          <h1 className="sr-only">
            {SITE.name} — {SITE.tagline}
          </h1>

          {/* Logo wordmark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SITE.logo}
            alt={SITE.name}
            className="mx-auto block w-[290px] max-w-full drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)] sm:w-[380px] md:w-[460px] lg:mx-0 lg:w-[520px]"
          />

          <div className="mt-6 space-y-0.5 font-mono text-sm uppercase tracking-[0.18em] text-foreground/65 sm:text-base">
            {SITE.taglineLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Button
              size="lg"
              render={<a href="#tour" />}
              className="h-12 gap-2 px-6 text-base font-semibold"
            >
              <CalendarDays className="size-4" />
              See Tour Dates
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<a href="#book" />}
              className="h-12 gap-2 border-white/15 bg-transparent px-6 text-base font-semibold hover:bg-white/5"
            >
              <Send className="size-4" />
              Book the Band
            </Button>
          </div>

          <SocialLinks className="mt-10 justify-center lg:justify-start" />
        </motion.div>

        {/* Right column — flippable latest-release player */}
        {latest && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-[330px] lg:mx-0 lg:ml-auto"
          >
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className="size-1.5 rounded-full bg-foreground/70" />
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-foreground/55">
                {latest.featured ? "Latest Release" : "Now Playing"}
              </span>
            </div>
            <TiltCard>
              <div className="relative aspect-square [perspective:1200px]">
                <motion.div
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 [transform-style:preserve-3d]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setFlipped(true);
                      play();
                    }}
                    aria-label={`Open ${latest.title} preview player`}
                    className="group absolute inset-0 overflow-hidden rounded-lg ring-1 ring-white/10 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.9)] [-webkit-backface-visibility:hidden] [backface-visibility:hidden]"
                  >
                    <SmartImage
                      src={latest.cover}
                      alt={`${latest.title} cover art`}
                      seed={1}
                      label={latest.title}
                      className="aspect-square w-full object-cover"
                    />
                    <span className="absolute inset-0 grid place-items-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                      <span className="grid size-14 place-items-center rounded-full bg-white/92 text-black opacity-0 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.9)] transition-all duration-300 group-hover:scale-105 group-hover:opacity-100">
                        <Play className="size-5 translate-x-0.5 fill-current" />
                      </span>
                    </span>
                  </button>

                  <div
                    className="absolute inset-0 overflow-hidden rounded-lg bg-black/72 p-5 ring-1 ring-white/10 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.9)] [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform:rotateY(180deg)]"
                    aria-label={`${latest.title} preview player`}
                  >
                    <SmartImage
                      src={latest.cover}
                      alt=""
                      seed={1}
                      className="absolute inset-0 h-full w-full scale-110 object-cover opacity-18 blur-xl"
                    />
                    <div className="relative flex h-full flex-col justify-between">
                      <button
                        type="button"
                        onClick={() => setFlipped(false)}
                        aria-label="Show cover art"
                        title="Show cover art"
                        className="ml-auto grid size-8 place-items-center rounded-full bg-white/10 text-foreground/55 transition-colors hover:text-foreground"
                      >
                        <RotateCcw className="size-3.5" />
                      </button>

                      <div className="text-center">
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-foreground/45">
                          Preview
                        </p>
                        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
                          {latest.title}
                        </h2>
                        <p className="mt-1 truncate text-sm text-foreground/55">
                          {latest.artist}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <AudioWaveform className="-mx-1" />

                        <button
                          type="button"
                          onClick={toggle}
                          aria-label={playing ? "Pause preview" : "Play preview"}
                          className="mx-auto grid size-14 place-items-center rounded-full bg-white text-black shadow-[0_18px_44px_-24px_rgba(255,255,255,0.75)] transition-transform hover:scale-105"
                        >
                          {playing ? (
                            <Pause className="size-5 fill-current" />
                          ) : (
                            <Play className="size-5 translate-x-0.5 fill-current" />
                          )}
                        </button>

                        <div>
                          <div
                            onClick={seek}
                            className="h-1.5 cursor-pointer rounded-full bg-white/18"
                          >
                            <div
                              className="h-full rounded-full bg-white transition-[width] duration-150"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="mt-2 flex justify-between font-mono text-[10px] tabular-nums text-foreground/45">
                            <span>{fmt(currentTime)}</span>
                            <span>{fmt(displayDuration)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </TiltCard>
            <button
              type="button"
              onClick={() => setFlipped((value) => !value)}
              className="mt-3 flex w-full items-baseline justify-between px-0.5 text-left"
            >
              <p className="font-display text-lg font-bold tracking-tight">
                {latest.title}
              </p>
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-foreground/45">
                {latest.status}
              </span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
