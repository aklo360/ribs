import { Mail, Clock, Sparkles } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { BookingForm } from "@/components/booking/booking-form";
import { SITE } from "@/lib/content";

export function BookingSection() {
  return (
    <Section id="book" eyebrow="Bookings" title="Book Roots in Blue Stone">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div className="flex flex-col gap-6">
            <p className="text-lg text-foreground/70">
              Festivals, wineries, weddings, private parties — from a two-man
              looping set to a full festival band. Tell us about your event and
              we&apos;ll get back to you with availability and a quote.
            </p>

            <div className="flex flex-col gap-3">
              {[
                {
                  icon: Sparkles,
                  title: "Built for any stage",
                  body: "Duo, trio, 5- or 7-piece — scaled to your room and budget.",
                },
                {
                  icon: Clock,
                  title: "Fast response",
                  body: "We review every inquiry and reply with real details.",
                },
              ].map((item) => (
                <div key={item.title} className="glass flex gap-3 rounded-2xl p-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <item.icon className="size-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-foreground/60">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={`mailto:${SITE.bookingEmail}`}
              className="glass inline-flex items-center gap-2 self-start rounded-full px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              <Mail className="size-4 text-primary" />
              Prefer email? {SITE.bookingEmail}
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
