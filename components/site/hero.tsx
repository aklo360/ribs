"use client";

import { motion } from "motion/react";
import { CalendarDays, Send, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "./smart-image";
import { SocialLinks } from "./social-links";
import { SITE, HERO_IMAGE, RELEASES } from "@/lib/content";

export function Hero() {
  const latest = RELEASES.find((r) => r.featured) ?? RELEASES[0];

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
        >
          <h1 className="sr-only">
            {SITE.name} — {SITE.tagline}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-2">
            {SITE.genres.map((g) => (
              <Badge
                key={g}
                variant="secondary"
                className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium tracking-wide text-foreground/70"
              >
                {g}
              </Badge>
            ))}
          </div>

          {/* Logo wordmark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SITE.logo}
            alt={SITE.name}
            className="w-[290px] max-w-full drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)] sm:w-[380px] md:w-[460px] lg:w-[520px]"
          />

          <p className="mt-6 max-w-md font-mono text-sm uppercase tracking-[0.18em] text-foreground/65 sm:text-base">
            {SITE.tagline}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
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

          <SocialLinks className="mt-10" />
        </motion.div>

        {/* Right column — floating album cover */}
        {latest && (
          <motion.a
            href="#music"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="group relative mx-auto w-full max-w-[300px] lg:mx-0 lg:ml-auto"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass-raised rotate-[-3deg] rounded-3xl p-3 transition-transform duration-500 group-hover:rotate-0"
            >
              <p className="mb-3 px-1 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-foreground/60">
                Latest Release
              </p>
              <div className="relative overflow-hidden rounded-2xl">
                <SmartImage
                  src={latest.cover}
                  alt={`${latest.title} cover art`}
                  seed={1}
                  className="aspect-square w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex size-14 items-center justify-center rounded-full bg-white text-black">
                    <Play className="size-6 translate-x-0.5 fill-current" />
                  </span>
                </span>
              </div>
              <div className="flex items-baseline justify-between px-1 pt-3">
                <p className="font-display text-lg font-bold tracking-tight">
                  {latest.title}
                </p>
                <p className="font-mono text-[0.65rem] uppercase tracking-widest text-foreground/55">
                  {latest.status}
                </p>
              </div>
            </motion.div>
          </motion.a>
        )}
      </div>
    </section>
  );
}
