import { Mail } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { BookingForm } from "@/components/booking/booking-form";
import { SITE, BIO } from "@/lib/content";

export function BookingSection() {
  return (
    <Section id="book" eyebrow="Bookings" title="Book Roots in Blue Stone">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div className="flex flex-col gap-7">
            {/* Verbatim line from the band's bio */}
            <blockquote className="border-l-2 border-white/20 pl-5 font-display text-xl font-semibold leading-snug tracking-tight text-foreground/90 sm:text-2xl">
              “{BIO[2]}”
            </blockquote>

            <p className="text-foreground/65">
              Wineries, festivals, weddings, private events — duo to full band.
              Send the details below.
            </p>

            <a
              href={`mailto:${SITE.bookingEmail}`}
              className="glass inline-flex items-center gap-2 self-start rounded-full px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              <Mail className="size-4" />
              {SITE.bookingEmail}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <BookingForm />
        </Reveal>
      </div>
    </Section>
  );
}
