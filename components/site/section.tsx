import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function Section({
  id,
  eyebrow,
  title,
  children,
  className,
  contentClassName,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28", className)}
    >
      <div className={cn("mx-auto w-full max-w-6xl", contentClassName)}>
        {(eyebrow || title) && (
          <Reveal className="mb-10">
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary/90">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {title}
              </h2>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
