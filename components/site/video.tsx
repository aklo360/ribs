import { Play } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { Button } from "@/components/ui/button";
import { YoutubeIcon } from "./icons";
import { SOCIALS } from "@/lib/content";

/**
 * Drop a YouTube video ID here to embed it inline (e.g. "dQw4w9WgXcQ").
 * Left empty by default — the current site has no embedded video, so we
 * surface a styled link to the channel instead.
 */
const FEATURED_VIDEO_ID = "";

export function Video() {
  return (
    <Section id="video" eyebrow="Watch" title="Live & Video">
      <Reveal>
        {FEATURED_VIDEO_ID ? (
          <div className="glass overflow-hidden rounded-3xl p-2">
            <div className="aspect-video w-full">
              <iframe
                title="Roots in Blue Stone video"
                src={`https://www.youtube.com/embed/${FEATURED_VIDEO_ID}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full rounded-2xl"
                style={{ border: 0 }}
              />
            </div>
          </div>
        ) : (
          <a
            href={SOCIALS.youtube.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-raised group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_50%,rgba(224,168,79,0.18),transparent_60%)]" />
            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
              <span className="flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110 glow">
                <Play className="size-8 translate-x-0.5 fill-current" />
              </span>
              <p className="font-display text-xl font-bold">Watch on YouTube</p>
              <Button variant="secondary" className="glass gap-2 text-foreground">
                <YoutubeIcon className="size-4 text-primary" />
                Open the channel
              </Button>
            </div>
          </a>
        )}
      </Reveal>
    </Section>
  );
}
