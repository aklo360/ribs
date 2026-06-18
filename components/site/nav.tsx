"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { NAV_LINKS, SITE } from "@/lib/content";
import { SocialLinks } from "./social-links";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass-nav py-2.5" : "py-4"
      )}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" aria-label={SITE.name} className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SITE.logo}
            alt={SITE.name}
            className="h-7 w-auto sm:h-8"
          />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.filter((l) => l.href !== "#tour").map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/65 transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            render={<a href="#tour" />}
            className="hidden border-white/15 bg-transparent font-semibold hover:bg-white/5 sm:inline-flex"
          >
            Tour Dates
          </Button>
          <Button
            render={<a href="#book" />}
            className="hidden font-semibold sm:inline-flex"
          >
            Book Now
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className="glass flex size-10 items-center justify-center rounded-full text-foreground/80 md:hidden"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="glass-nav border-l border-border w-72 px-6 py-8"
            >
              <SheetTitle className="font-display text-lg font-bold tracking-tight">
                {SITE.name}
              </SheetTitle>
              <div className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <SheetClose
                    key={l.href}
                    render={
                      <a
                        href={l.href}
                        className="rounded-lg px-3 py-3 text-lg font-medium text-foreground/80 transition-colors hover:bg-white/5 hover:text-foreground"
                      >
                        {l.label}
                      </a>
                    }
                  />
                ))}
                <SheetClose
                  render={
                    <a
                      href="#book"
                      className="mt-3 rounded-lg bg-primary px-3 py-3 text-center text-lg font-semibold text-primary-foreground"
                    >
                      Book the Band
                    </a>
                  }
                />
              </div>
              <SocialLinks className="mt-8" />
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
