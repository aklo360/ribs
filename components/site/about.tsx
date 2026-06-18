import { Users } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { SmartImage } from "./smart-image";
import { Badge } from "@/components/ui/badge";
import { BIO, MEMBERS, LINEUPS, HERO_IMAGE } from "@/lib/content";

export function About() {
  return (
    <Section id="about" eyebrow="The Band" title="About Roots in Blue Stone">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <div className="space-y-5">
            {BIO.map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-lg leading-relaxed text-foreground/85"
                    : "leading-relaxed text-foreground/65"
                }
              >
                {para}
              </p>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              {MEMBERS.map((m) => (
                <div
                  key={m.name}
                  className="glass flex items-center gap-3 rounded-2xl px-4 py-3"
                >
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Users className="size-4" />
                  </div>
                  <div className="leading-tight">
                    <p className="font-semibold text-foreground">{m.name}</p>
                    <p className="text-xs text-foreground/55">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <SmartImage
            src={HERO_IMAGE}
            alt="Roots in Blue Stone"
            seed={2}
            className="aspect-[4/5] w-full rounded-3xl object-cover"
          />
        </Reveal>
      </div>

      {/* Lineup configurations */}
      <Reveal delay={0.1} className="mt-12">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-foreground/50">
          Book us as a…
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LINEUPS.map((l) => (
            <div key={l.key} className="glass rounded-2xl p-5">
              <Badge className="mb-3 rounded-full bg-primary/15 text-primary">
                {l.label}
              </Badge>
              <p className="text-sm leading-relaxed text-foreground/65">{l.blurb}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
