"use client";

import { useState } from "react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { SmartImage } from "./smart-image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GALLERY } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <Section id="gallery" eyebrow="On Stage" title="Gallery">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {GALLERY.map((src, i) => (
          <Reveal key={src} delay={(i % 4) * 0.05}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "glass group relative block w-full overflow-hidden rounded-2xl",
                i % 5 === 0 ? "aspect-[3/4]" : "aspect-square"
              )}
            >
              <SmartImage
                src={src}
                alt={`Roots in Blue Stone live ${i + 1}`}
                seed={i}
                className="mono h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          </Reveal>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl border-white/10 bg-transparent p-0 shadow-none ring-0">
          <DialogTitle className="sr-only">Photo</DialogTitle>
          {active !== null && (
            <SmartImage
              src={GALLERY[active]}
              alt={`Roots in Blue Stone live ${active + 1}`}
              seed={active}
              className="max-h-[80vh] w-full rounded-2xl object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
