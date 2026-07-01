import { Mail, Star } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { BookingForm } from "@/components/booking/booking-form";
import { SITE, BIO } from "@/lib/content";

export function BookingSection() {
  return (
    <Section id="book" eyebrow="Bookings" title="Book the Band">
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Reveal className="min-w-0">
          <div className="flex min-w-0 flex-col gap-7">
            {/* Verbatim line from the band's bio */}
            <blockquote className="border-l-2 border-white/20 pl-5 font-display text-xl font-semibold leading-snug tracking-tight text-foreground/90 sm:text-2xl">
              “{BIO[2]}”
            </blockquote>

            <p className="text-foreground/65">
              Wineries, festivals, weddings, private events — duo to full band.
              Send the details below.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${SITE.bookingEmail}`}
                className="glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                <Mail className="size-4" />
                {SITE.bookingEmail}
              </a>
              <a
                href={SITE.dusk}
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:text-foreground"
              >
                <Star className="size-4 fill-current" />
                <span className="font-semibold">{SITE.duskRating}</span>
                <span className="text-foreground/55">
                  · {SITE.duskReviews} reviews on Dusk
                </span>
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0">
          <BookingForm />
        </Reveal>
      </div>
    </Section>
  );
}
