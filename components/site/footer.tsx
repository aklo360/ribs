import { Mail } from "lucide-react";
import { SocialLinks } from "./social-links";
import { SITE, NAV_LINKS } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative mt-10 border-t border-border px-5 py-14 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <p className="font-display text-2xl font-extrabold brand-gradient">
              Roots in Blue Stone
            </p>
            <p className="mt-3 text-sm text-foreground/60">{SITE.tagline}</p>
            <a
              href={`mailto:${SITE.bookingEmail}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-primary"
            >
              <Mail className="size-4" />
              {SITE.bookingEmail}
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#book"
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Book
              </a>
            </nav>
            <SocialLinks />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-foreground/45 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>{SITE.homeBase}</p>
        </div>
      </div>
    </footer>
  );
}
