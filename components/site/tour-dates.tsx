import { MapPin, Ticket, CalendarOff } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { upcomingShows, formatShowDate, type ShowStatus } from "@/lib/tour";

const STATUS_LABEL: Record<ShowStatus, string> = {
  onsale: "On Sale",
  soldout: "Sold Out",
  free: "Free",
  announced: "Announced",
  cancelled: "Cancelled",
};

export function TourDates() {
  const shows = upcomingShows();

  return (
    <Section id="tour" eyebrow="Live" title="Tour Dates">
      {shows.length === 0 ? (
        <Reveal>
          <div className="glass flex flex-col items-center gap-4 rounded-3xl px-6 py-16 text-center">
            <CalendarOff className="size-8 text-primary" />
            <p className="max-w-md text-foreground/70">
              No public dates announced right now. Want Roots in Blue Stone at
              your venue, festival, or private event?
            </p>
            <Button render={<a href="#book" />} className="font-semibold glow">
              Book the Band
            </Button>
          </div>
        </Reveal>
      ) : (
        <div className="flex flex-col gap-3">
          {shows.map((show, i) => {
            const d = formatShowDate(show.date);
            const soldout = show.status === "soldout";
            return (
              <Reveal key={`${show.date}-${show.venue}`} delay={i * 0.05}>
                <div className="glass group flex flex-col gap-4 rounded-2xl p-4 transition-colors hover:bg-white/[0.06] sm:flex-row sm:items-center sm:gap-6 sm:p-5">
                  {/* Date chip */}
                  <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/12 py-2 text-primary">
                    <span className="text-xs font-bold tracking-wider">
                      {d.month}
                    </span>
                    <span className="font-display text-2xl font-extrabold leading-none">
                      {d.day}
                    </span>
                    <span className="text-[0.65rem] text-primary/70">{d.weekday}</span>
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-bold tracking-tight">
                        {show.venue}
                      </h3>
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
                  <div className="shrink-0">
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
                        className="w-full gap-2 font-semibold sm:w-auto"
                      >
                        <Ticket className="size-4" />
                        Tickets
                      </Button>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </Section>
  );
}
