"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { SmartImage } from "./smart-image";
import { GALLERY } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Gallery() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const thumbnailRailRef = useRef<HTMLDivElement | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const photos = GALLERY;
  const total = photos.length;

  const go = useCallback(
    (n: number) => {
      setDir(n > i ? 1 : -1);
      setI((n + total) % total);
    },
    [i, total]
  );
  const next = useCallback(() => {
    setDir(1);
    setI((p) => (p + 1) % total);
  }, [total]);
  const prev = useCallback(() => {
    setDir(-1);
    setI((p) => (p - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    const rail = thumbnailRailRef.current;
    const activeThumbnail = thumbnailRefs.current[i];

    if (!rail || !activeThumbnail) return;

    const target =
      activeThumbnail.offsetLeft -
      rail.clientWidth / 2 +
      activeThumbnail.clientWidth / 2;
    const maxScroll = rail.scrollWidth - rail.clientWidth;

    rail.scrollTo({
      left: Math.max(0, Math.min(target, maxScroll)),
      behavior: "smooth",
    });
  }, [i]);

  return (
    <Section id="gallery" eyebrow="On Stage" title="Gallery">
      <Reveal>
        {/* Stage — one big image at a time, never cropped */}
        <div className="relative flex h-[52vh] max-h-[600px] min-h-[320px] items-center justify-center overflow-hidden rounded-xl bg-white/[0.02] hairline">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={i}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center p-2"
            >
              <SmartImage
                src={photos[i]}
                alt={`Roots in Blue Stone ${i + 1}`}
                seed={i}
                className="max-h-full max-w-full rounded-lg object-contain"
              />
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="glass absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-foreground/80 transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="glass absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-foreground/80 transition-colors hover:text-foreground"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Counter */}
          <span className="glass absolute bottom-3 right-3 z-10 rounded-full px-3 py-1 font-mono text-xs text-foreground/70">
            {i + 1} / {total}
          </span>
        </div>

        {/* Thumbnail strip */}
        <div
          ref={thumbnailRailRef}
          className="mt-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]"
        >
          {photos.map((src, n) => (
            <button
              key={src}
              ref={(node) => {
                thumbnailRefs.current[n] = node;
              }}
              type="button"
              onClick={() => go(n)}
              aria-label={`Photo ${n + 1}`}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-md transition-all",
                n === i
                  ? "ring-2 ring-white"
                  : "opacity-50 hover:opacity-90"
              )}
            >
              <SmartImage
                src={src}
                alt={`Thumbnail ${n + 1}`}
                seed={n}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
