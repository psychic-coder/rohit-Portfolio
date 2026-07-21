"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { site } from "@/data/site";

// The heavy canvas visual is lazy-loaded and never server-rendered.
const GraphVisual = dynamic(() => import("./GraphVisual"), { ssr: false });

export default function Hero() {
  const reduced = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.21, 0.6, 0.35, 1] as const },
  });

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <GraphVisual />
      {/* Radial vignette so text stays readable over the graph */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0A0A0B_78%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-wrap px-6 pt-24">
        <motion.p {...rise(0)} className="eyebrow">
          systems · graphs · chaos-tested
        </motion.p>

        <motion.h1
          {...rise(0.08)}
          className="mt-4 max-w-3xl font-mono text-4xl font-bold leading-tight tracking-tight text-ink md:text-6xl"
        >
          {site.name}
          <span className="block text-signal">builds infrastructure that survives failure.</span>
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-ink-dim md:text-lg"
        >
          {site.positioning}
        </motion.p>

        <motion.div {...rise(0.24)} className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton href={site.resume} variant="solid" download>
            Download resume
          </MagneticButton>
          <MagneticButton href={site.github} external>
            GitHub → psychic-coder
          </MagneticButton>
          <MagneticButton href={`mailto:${site.email}`}>{site.email}</MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
