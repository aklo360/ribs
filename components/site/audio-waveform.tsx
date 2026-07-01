"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "./player-provider";
import { cn } from "@/lib/utils";

export function AudioWaveform({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { analyser } = usePlayer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const samples = analyser ? new Uint8Array(analyser.fftSize) : null;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const mid = h / 2;
      const points = 96;

      if (analyser && samples) {
        analyser.getByteTimeDomainData(samples);
      }

      const glow = ctx.createLinearGradient(0, 0, w, 0);
      glow.addColorStop(0, "rgba(255,255,255,0.35)");
      glow.addColorStop(0.5, "rgba(255,255,255,0.95)");
      glow.addColorStop(1, "rgba(255,255,255,0.35)");

      ctx.lineWidth = 2;
      ctx.strokeStyle = glow;
      ctx.beginPath();

      for (let i = 0; i < points; i += 1) {
        const x = (i / (points - 1)) * w;
        const sampleIndex = samples
          ? Math.floor((i / (points - 1)) * (samples.length - 1))
          : 0;
        const normalized = samples ? (samples[sampleIndex] - 128) / 128 : 0;
        const y = mid + normalized * h * 0.42;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.globalAlpha = 1;
      ctx.shadowColor = "rgba(255,255,255,0.32)";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.restore();
      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [analyser]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("h-16 w-full", className)}
    />
  );
}
