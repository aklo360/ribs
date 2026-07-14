"use client";

import { useState } from "react";
import { MapPin, Bell, CalendarOff, ArrowUpRight, ChevronDown } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  upcomingShows,
  formatShowDate,
  type Show,
  type ShowStatus,
} from "@/lib/tour";
import { SITE } from "@/lib/content";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<ShowStatus, string> = {
  onsale: "On Sale",
  soldout: "Sold Out",
  free: "Free",
  announced: "Announced",
  cancelled: "Cancelled",
};

const INITIAL = 4;

function rangeLabel(show: Show): string | null {
  if (!show.endDate) return null;
  const s = new Date(`${show.date}T12:00:00`);
  const e = new Date(`${show.endDate}T12:00:00`);
  const sm = s.toLocaleDateString("en-US", { month: "short" });
  const em = e.toLocaleDateString("en-US", { month: "short" });
  return sm === em
    ? `${sm} ${s.getDate()}–${e.getDate()}`
    : `${sm} ${s.getDate()} – ${em} ${e.getDate()}`;
}

function ticketPriceLabel(show: Show): string | null {
  return show.priceLabel ?? (show.status === "free" ? STATUS_LABEL.free : null);
}

export function TourDates() {
  const all = upcomingShows();
  const [expanded, setExpanded] = useState(false);
  const shows = expanded ? all : all.slice(0, INITIAL);
  const remaining = all.length - INITIAL;

  return (
    <Section id="tour" eyebrow="Live" title="Tour Dates">
      {all.length === 0 ? (
        <Reveal>
          <div className="glass flex flex-col items-center gap-4 rounded-2xl px-6 py-16 text-center">
            <CalendarOff className="size-8 text-foreground/70" />
            <p className="max-w-md text-foreground/70">
              No upcoming dates announced right now. Want Roots in Blue Stone at
              your event?
            </p>
            <Button render={<a href="#book" />} className="font-semibold glow">
              Book the Band
            </Button>
          </div>
        </Reveal>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {shows.map((show, i) => {
              const d = formatShowDate(show.date);
              const range = rangeLabel(show);
              const soldout = show.status === "soldout";
              const price = ticketPriceLabel(show);
              return (
                <Reveal
                  key={`${show.date}-${show.venue}`}
                  delay={Math.min(i, INITIAL) * 0.04}
                >
                  <div className="glass group flex flex-col gap-4 rounded-2xl p-4 transition-colors hover:bg-white/[0.06] sm:flex-row sm:items-center sm:gap-6 sm:p-5">
                    {/* Date chip — always the start date */}
                    <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-white/[0.07] py-2">
                      <span className="text-xs font-bold tracking-wider text-foreground/90">
                        {d.month}
                      </span>
                      <span className="font-display text-2xl font-extrabold leading-none">
                        {d.day}
                      </span>
                      <span className="text-[0.65rem] text-foreground/50">
                        {d.weekday}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-bold tracking-tight">
                          {show.venue}
                        </h3>
                        {range && (
                          <Badge
                            variant="secondary"
                            className="rounded-full bg-white/5 text-xs font-medium text-foreground/70"
                          >
                            {range}
                          </Badge>
                        )}
                        {show.lineup && (
                          <Badge
                            variant="secondary"
                            className="rounded-full bg-white/5 text-xs text-foreground/70"
                          >
                            {show.lineup}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground/60">
                        <MapPin className="size-3.5" />
                        {show.city}
                        {show.region ? `, ${show.region}` : ""}
                        {show.note ? ` · ${show.note}` : ""}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                      {price && (
                        <Badge
                          variant="secondary"
                          className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-foreground/75"
                        >
                          {price}
                        </Badge>
                      )}
                      {soldout || !show.ticketUrl ? (
                        <Badge
                          variant="secondary"
                          className="rounded-full bg-white/5 px-4 py-2 text-foreground/60"
                        >
                          {show.status ? STATUS_LABEL[show.status] : "Details soon"}
                        </Badge>
                      ) : (
                        <Button
                          render={
                            <a
                              href={show.ticketUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          }
                          className="min-w-24 gap-2 font-semibold"
                        >
                          <Bell className="size-4" />
                          RSVP
                        </Button>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Expand / collapse */}
          {remaining > 0 && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground"
              >
                {expanded ? "Show less" : `Show ${remaining} more dates`}
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    expanded && "rotate-180"
                  )}
                />
              </button>
            </div>
          )}

          {/* Request a show */}
          <Reveal delay={0.1}>
            <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 px-5 py-4 text-center sm:flex-row sm:text-left">
              <p className="text-sm text-foreground/65">
                Don&apos;t see a show near you?
              </p>
              <a
                href={SITE.bandsintown}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-foreground/70"
              >
                Request a show
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </Reveal>
        </>
      )}
    </Section>
  );
}
