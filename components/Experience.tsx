import SectionReveal from "./SectionReveal";
import { experience } from "@/data/experience";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-wrap px-6 py-24">
      <SectionReveal>
        <p className="eyebrow">experience</p>
        <h2 className="mt-4 font-mono text-2xl font-bold text-ink md:text-3xl">
          Where I&apos;ve shipped
        </h2>
      </SectionReveal>

      <ol className="mt-12 space-y-0 border-l border-line">
        {experience.map((job, i) => (
          <SectionReveal key={job.company + i} delay={i * 0.08}>
            <li className="relative pb-12 pl-8 last:pb-0">
              {/* Timeline node */}
              <span
                aria-hidden="true"
                className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${
                  job.current ? "bg-signal" : "bg-line"
                }`}
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-mono text-lg font-semibold text-ink">
                  {job.company}
                </h3>
                <span className="font-mono text-xs text-ink-dim">{job.role}</span>
                {job.period && (
                  <span className="font-mono text-xs text-ink-faint">{job.period}</span>
                )}
                {job.current && (
                  <span className="rounded border border-signal/30 bg-signal-dim px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-signal">
                    current
                  </span>
                )}
              </div>
              <ul className="mt-3 space-y-2 font-sans text-sm leading-relaxed text-ink-dim">
                {job.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                    {b}
                  </li>
                ))}
              </ul>
              <ul className="mt-4 flex flex-wrap gap-2">
                {job.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-ink-dim"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </li>
          </SectionReveal>
        ))}
      </ol>
    </section>
  );
}
