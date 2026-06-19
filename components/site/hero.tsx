"use client";

import { motion } from "motion/react";
import { CalendarDays, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartImage } from "./smart-image";
import { SocialLinks } from "./social-links";
import { ReleasePlayer } from "./release-player";
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

        {/* Right column — minimal inline player for the latest release */}
        {latest?.previewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-[336px] lg:mx-0 lg:ml-auto"
          >
            <ReleasePlayer release={latest} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
