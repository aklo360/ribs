import { Mail } from "lucide-react";
import { SocialLinks } from "./social-links";
import { SITE, NAV_LINKS } from "@/lib/content";

function NewSphereMark() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 128 128"
      fill="currentColor"
      aria-hidden
      className="inline-block"
    >
      <path d="M50.4 78.5a75.1 75.1 0 0 0-28.5 6.9l24.2-65.7c.7-2 1.9-3.2 3.4-3.2h29c1.5 0 2.7 1.2 3.4 3.2l24.2 65.7s-11.6-7-28.5-7L67 45.5c-.4-1.7-1.6-2.8-2.9-2.8-1.3 0-2.5 1.1-2.9 2.7L50.4 78.5Zm-1.1 28.2Zm-4.2-20.2c-2 6.6-.6 15.8 4.2 20.2a17.5 17.5 0 0 1 .2-.7 5.5 5.5 0 0 1 5.7-4.5c2.8.1 4.3 1.5 4.7 4.7.2 1.1.2 2.3.2 3.5v.4c0 2.7.7 5.2 2.2 7.4a13 13 0 0 0 5.7 4.9v-.3l-.2-.3c-1.8-5.6-.5-9.5 4.4-12.8l1.5-1a73 73 0 0 0 3.2-2.2 16 16 0 0 0 6.8-11.4c.3-2 .1-4-.6-6l-.8.6-1.6 1a37 37 0 0 1-22.4 2.7c-5-.7-9.7-2-13.2-6.2Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-10 border-t border-border px-5 py-14 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SITE.logo} alt={SITE.name} className="h-12 w-auto" />
            <p className="mt-4 max-w-xs font-mono text-xs uppercase tracking-[0.16em] text-foreground/55">
              {SITE.tagline}
            </p>
            <a
              href={`mailto:${SITE.bookingEmail}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              <Mail className="size-4" />
              {SITE.bookingEmail}
            </a>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <nav className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
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
                className="text-sm font-medium text-foreground transition-colors hover:text-foreground/70"
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
          <a
            href="https://newsphere.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/35 transition-colors hover:text-foreground/70"
          >
            Designed by
            <NewSphereMark />
            NewSphere
          </a>
        </div>
      </div>
    </footer>
  );
}
