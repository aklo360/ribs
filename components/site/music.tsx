import { Disc3 } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { SmartImage } from "./smart-image";
import { Badge } from "@/components/ui/badge";
import { RELEASES, SPOTIFY_ARTIST_ID, ORIGINALS, STREAMING } from "@/lib/content";
import { STREAM_ICONS } from "./icons";

export function Music() {
  const featured = RELEASES.find((r) => r.featured) ?? RELEASES[0];

  return (
    <Section id="music" eyebrow="Listen" title="Music">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Featured release — stacked: square cover on top, details below */}
        <Reveal>
          <div className="glass-raised flex h-full flex-col items-center gap-6 rounded-xl p-6 text-center sm:p-8">
            <SmartImage
              src={featured.cover}
              alt={`${featured.title} cover art`}
              seed={1}
              label={featured.title}
              className="aspect-square w-full max-w-[300px] rounded-[6px] object-cover"
            />
            <div className="flex w-full flex-col items-center">
              <Badge className="mb-3 gap-1.5 rounded-full bg-white/10 text-foreground">
                <Disc3 className="size-3" />
                {featured.type} · {featured.status}
              </Badge>
              <h3 className="font-display text-3xl font-bold tracking-tight">
                {featured.title}
              </h3>

              {/* Listen on… platform icons (from the LANDR smart link) */}
              <div className="mt-5 flex flex-nowrap items-center justify-center gap-1.5 sm:gap-2.5">
                {STREAMING.map((p) => {
                  const Icon = STREAM_ICONS[p.key];
                  return (
                    <a
                      key={p.key}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Listen on ${p.label}`}
                      title={p.label}
                      className="glass flex size-8 shrink-0 items-center justify-center rounded-full text-foreground/70 transition-all hover:scale-105 hover:text-foreground sm:size-11"
                    >
                      <Icon className="size-4 sm:size-[18px]" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Spotify embed */}
        <Reveal delay={0.1}>
          <div className="glass h-full overflow-hidden rounded-xl p-2">
            <iframe
              title="Roots in Blue Stone on Spotify"
              src={`https://open.spotify.com/embed/artist/${SPOTIFY_ARTIST_ID}?utm_source=generator&theme=0`}
              width="100%"
              height="100%"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="min-h-[420px] w-full rounded-lg"
              style={{ border: 0 }}
            />
          </div>
        </Reveal>
      </div>

      {/* Originals */}
      <Reveal delay={0.15} className="mt-8">
        <div className="glass flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl px-5 py-4">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/50">
            Originals
          </span>
          {ORIGINALS.map((song) => (
            <span
              key={song}
              className="flex items-center gap-2 text-sm text-foreground/80"
            >
              <span className="size-1.5 rounded-full bg-foreground/60" />“{song}”
            </span>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
