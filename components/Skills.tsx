"use client";

import { useState } from "react";
import SectionReveal from "./SectionReveal";
import { skillGroups } from "@/data/skills";

export default function Skills() {
  const [active, setActive] = useState(skillGroups[0].id);
  const current = skillGroups.find((g) => g.id === active)!;

  return (
    <section id="skills" className="mx-auto max-w-wrap px-6 py-24">
      <SectionReveal>
        <p className="eyebrow">skills</p>
        <h2 className="mt-4 font-mono text-2xl font-bold text-ink md:text-3xl">
          The toolbox, by layer
        </h2>
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <div className="mt-10 grid gap-6 md:grid-cols-[240px_1fr]">
          {/* Category selector */}
          <div
            role="tablist"
            aria-label="Skill categories"
            className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible"
          >
            {skillGroups.map((g) => (
              <button
                key={g.id}
                role="tab"
                aria-selected={active === g.id}
                onClick={() => setActive(g.id)}
                className={`shrink-0 rounded-md border px-4 py-2.5 text-left font-mono text-xs uppercase tracking-widest transition-colors ${
                  active === g.id
                    ? "border-signal/50 bg-signal-dim text-signal"
                    : "border-line text-ink-dim hover:border-ink-faint hover:text-ink"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div
            role="tabpanel"
            className="grid content-start gap-3 rounded-lg border border-line bg-surface p-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {current.items.map((item) => (
              <div
                key={item}
                className="rounded-md border border-line bg-base px-4 py-3 font-mono text-sm text-ink transition-colors hover:border-signal/40 hover:text-signal"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
