"use client";

import { motion } from "motion/react";
import { CalendarDays, Disc3, Send, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "./smart-image";
import { SocialLinks } from "./social-links";
import { SITE, HERO_IMAGE, RELEASES } from "@/lib/content";

export function Hero() {
  const latest = RELEASES.find((r) => r.featured) ?? RELEASES[0];

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Background image + overlays */}
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src={HERO_IMAGE}
          alt="Roots in Blue Stone performing live"
          className="h-full w-full object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pt-28 pb-16 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge className="glass gap-1.5 rounded-full border-0 px-3 py-1 text-foreground/80">
              <MapPin className="size-3 text-primary" />
              {SITE.homeBase}
            </Badge>
            {SITE.genres.map((g) => (
              <Badge
                key={g}
                variant="secondary"
                className="rounded-full bg-white/5 px-3 py-1 text-foreground/70"
              >
                {g}
              </Badge>
            ))}
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            <span className="block text-foreground">Roots in</span>
            <span className="block brand-gradient text-glow">Blue Stone</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-foreground/70 sm:text-xl">
            {SITE.tagline}
          </p>

          {/* Three priority CTAs */}
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
              variant="secondary"
              render={<a href="#music" />}
              className="glass h-12 gap-2 px-6 text-base font-semibold text-foreground hover:text-primary"
            >
              <Disc3 className="size-4" />
              Latest Release
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
      </div>

      {/* Floating "now playing" chip — Spotify-app flavor */}
      {latest && (
        <motion.a
          href="#music"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass-raised absolute bottom-6 right-5 z-10 hidden items-center gap-3 rounded-2xl p-3 pr-5 sm:right-8 md:flex"
        >
          <SmartImage
            src={latest.cover}
            alt={latest.title}
            seed={1}
            className="size-12 rounded-xl object-cover"
          />
          <div className="leading-tight">
            <p className="text-[0.7rem] font-medium uppercase tracking-wider text-primary">
              {latest.status}
            </p>
            <p className="text-sm font-semibold text-foreground">{latest.title}</p>
          </div>
          <span className="ml-1 flex items-end gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 rounded-full bg-primary"
                animate={{ height: [6, 16, 6] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: "easeInOut",
                }}
              />
            ))}
          </span>
        </motion.a>
      )}
    </section>
  );
}
