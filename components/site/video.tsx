"use client";

import { useRef, useState } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { SmartImage } from "./smart-image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { YoutubeIcon } from "./icons";
import { VIDEOS, SOCIALS } from "@/lib/content";

export function Video() {
  const [active, setActive] = useState<(typeof VIDEOS)[number] | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <Section id="video" eyebrow="Watch" title="Live & Video">
      <Reveal>
        <div className="relative">
          {/* Carousel */}
          <div
            ref={scroller}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {VIDEOS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setActive(v)}
                className="group w-[300px] shrink-0 snap-start text-left sm:w-[340px]"
              >
                <div className="glass relative aspect-video overflow-hidden rounded-xl">
                  <SmartImage
                    src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                    alt={v.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/45">
                    <span className="flex size-14 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110">
                      <Play className="size-6 translate-x-0.5 fill-current" />
                    </span>
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-medium text-foreground/85">
                  {v.title}
                </p>
              </button>
            ))}
          </div>

          {/* Arrows */}
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="glass absolute -left-3 top-[28%] hidden size-10 items-center justify-center rounded-full text-foreground/80 hover:text-foreground sm:flex"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="glass absolute -right-3 top-[28%] hidden size-10 items-center justify-center rounded-full text-foreground/80 hover:text-foreground sm:flex"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            render={
              <a href={SOCIALS.youtube.url} target="_blank" rel="noopener noreferrer" />
            }
            className="gap-2 border-white/15 bg-transparent hover:bg-white/5"
          >
            <YoutubeIcon className="size-4" />
            View the channel
          </Button>
        </div>
      </Reveal>

      {/* Lightbox player */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          className="max-w-none overflow-hidden border-white/10 bg-black p-0"
          style={{ width: "min(96vw, calc(92svh * 16 / 9))" }}
        >
          <DialogTitle className="sr-only">{active?.title}</DialogTitle>
          {active && (
            <div className="aspect-video w-full overflow-hidden">
              <iframe
                title={active.title}
                src={`https://www.youtube.com/embed/${active.id}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
                style={{ border: 0 }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
