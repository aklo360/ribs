/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Image with a graceful branded fallback. If the remote source fails to load
 * (e.g. the band's Wix CDN blocks hotlinking), we render an amber/slate gradient
 * tile with optional label instead of a broken image. Swap `src` for a local
 * /public asset to make it permanent.
 */
export function SmartImage({
  src,
  alt,
  className,
  label,
  seed = 0,
}: {
  src?: string;
  alt: string;
  className?: string;
  label?: string;
  seed?: number;
}) {
  const [failed, setFailed] = useState(!src);

  const gradients = [
    "linear-gradient(135deg, #1a2740 0%, #0b0f1a 55%, #2a1d0e 100%)",
    "linear-gradient(140deg, #122033 0%, #0b0f1a 60%, #3a2913 100%)",
    "linear-gradient(135deg, #0f1626 0%, #14233a 50%, #1d1407 100%)",
    "linear-gradient(135deg, #201708 0%, #0b0f1a 55%, #15243b 100%)",
  ];

  if (failed) {
    return (
      <div
        aria-label={alt}
        role="img"
        className={cn(
          "relative flex items-center justify-center overflow-hidden",
          className
        )}
        style={{ background: gradients[seed % gradients.length] }}
      >
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,rgba(224,168,79,0.25),transparent_45%),radial-gradient(circle_at_80%_90%,rgba(61,169,252,0.18),transparent_45%)]" />
        {label ? (
          <span className="font-display relative z-10 px-4 text-center text-sm font-semibold tracking-wide text-foreground/70">
            {label}
          </span>
        ) : (
          <span className="font-display relative z-10 text-2xl font-bold tracking-tight text-foreground/30">
            RIBS
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
