"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { Metric } from "@/data/projects";

/** Animated stat card. Amber ("chaos") is reserved for latency/chaos metrics. */
export default function StatCounter({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  const decimals = metric.decimals ?? 0;

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(metric.value);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(metric.value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, metric.value]);

  const tone =
    metric.tone === "chaos"
      ? "text-chaos border-chaos/30 bg-chaos-dim"
      : "text-signal border-signal/30 bg-signal-dim";

  return (
    <div
      ref={ref}
      className={`rounded-md border px-5 py-4 font-mono ${tone}`}
    >
      <div className="text-3xl font-bold tabular-nums md:text-4xl">
        {metric.prefix}
        {display.toFixed(decimals)}
        {metric.suffix}
      </div>
      <div className="mt-1 text-xs text-ink-dim">{metric.label}</div>
    </div>
  );
}
