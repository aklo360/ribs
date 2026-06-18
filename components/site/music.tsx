import { Disc3, Play } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { SmartImage } from "./smart-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RELEASES,
  SOCIALS,
  SPOTIFY_ARTIST_ID,
  ORIGINALS,
} from "@/lib/content";
import { SOCIAL_ICONS } from "./icons";

const PLATFORMS = [
  { key: "spotify", ...SOCIALS.spotify },
  { key: "appleMusic", ...SOCIALS.appleMusic },
  { key: "youtube", ...SOCIALS.youtube },
] as const;

export function Music() {
  const featured = RELEASES.find((r) => r.featured) ?? RELEASES[0];

  return (
    <Section id="music" eyebrow="Listen" title="New & Now Playing">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Featured release */}
        <Reveal>
          <div className="glass-raised flex h-full flex-col gap-6 rounded-3xl p-6 sm:flex-row sm:p-7">
            <SmartImage
              src={featured.cover}
              alt={`${featured.title} cover art`}
              seed={1}
              label={featured.title}
              className="aspect-square w-full shrink-0 rounded-2xl object-cover sm:w-44"
            />
            <div className="flex flex-col">
              <Badge className="mb-3 w-fit gap-1.5 rounded-full bg-primary/15 text-primary">
                <Disc3 className="size-3" />
                {featured.type} · {featured.status}
              </Badge>
              <h3 className="font-display text-3xl font-bold tracking-tight">
                {featured.title}
              </h3>
              <p className="mt-2 max-w-sm text-sm text-foreground/65">
                The latest from Roots in Blue Stone — stream it now on your
                platform of choice.
              </p>
              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                <Button
                  render={
                    <a
                      href={featured.listenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  className="gap-2 font-semibold glow"
                >
                  <Play className="size-4" />
                  Listen Now
                </Button>
                <div className="flex items-center gap-2">
                  {PLATFORMS.map((p) => {
                    const Icon = SOCIAL_ICONS[p.key];
                    return (
                      <a
                        key={p.key}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={p.label}
                        title={p.label}
                        className="glass flex size-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:text-primary"
                      >
                        <Icon className="size-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Spotify embed */}
        <Reveal delay={0.1}>
          <div className="glass overflow-hidden rounded-3xl p-2">
            <iframe
              title="Roots in Blue Stone on Spotify"
              src={`https://open.spotify.com/embed/artist/${SPOTIFY_ARTIST_ID}?utm_source=generator&theme=0`}
              width="100%"
              height="100%"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="min-h-[400px] w-full rounded-2xl"
              style={{ border: 0 }}
            />
          </div>
        </Reveal>
      </div>

      {/* Originals marquee */}
      <Reveal delay={0.15} className="mt-8">
        <div className="glass flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl px-5 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
            Originals
          </span>
          {ORIGINALS.map((song) => (
            <span key={song} className="flex items-center gap-2 text-sm text-foreground/80">
              <span className="size-1.5 rounded-full bg-primary" />“{song}”
            </span>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
