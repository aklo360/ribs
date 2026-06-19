"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Cursor-tracking 3D tilt (orbit) effect with a moving glare.
 * Rotates its contents in 3D space toward the pointer; resets on leave.
 */
export function TiltCard({
  children,
  className,
  max = 14,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setS({
      ry: (px - 0.5) * 2 * max,
      rx: -(py - 0.5) * 2 * max,
      gx: px * 100,
      gy: py * 100,
      active: true,
    });
  };
  const reset = () => setS((p) => ({ ...p, rx: 0, ry: 0, active: false }));

  return (
    <div className={cn("[perspective:1000px]", className)}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className="relative [transform-style:preserve-3d] transition-transform duration-150 ease-out will-change-transform"
        style={{
          transform: `rotateX(${s.rx}deg) rotateY(${s.ry}deg) scale(${
            s.active ? 1.03 : 1
          })`,
        }}
      >
        {children}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg transition-opacity duration-200"
          style={{
            opacity: s.active ? 1 : 0,
            background: `radial-gradient(circle at ${s.gx}% ${s.gy}%, rgba(255,255,255,0.28), transparent 45%)`,
          }}
        />
      </div>
    </div>
  );
}
