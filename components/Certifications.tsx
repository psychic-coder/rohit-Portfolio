import SectionReveal from "./SectionReveal";
import { credentials } from "@/data/certifications";

export default function Certifications() {
  const achievement = credentials.find((c) => c.kind === "achievement");
  const certs = credentials.filter((c) => c.kind === "certification");

  return (
    <section id="credentials" className="mx-auto max-w-wrap px-6 py-24">
      <SectionReveal>
        <p className="eyebrow">credentials</p>
        <h2 className="mt-4 font-mono text-2xl font-bold text-ink md:text-3xl">
          Certifications &amp; achievements
        </h2>
      </SectionReveal>

      {achievement && (
        <SectionReveal delay={0.08}>
          <div className="mt-10 rounded-lg border border-signal/30 bg-signal-dim p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-signal">
              achievement
            </p>
            <p className="mt-2 font-mono text-lg font-semibold text-ink">
              {achievement.title}
            </p>
          </div>
        </SectionReveal>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certs.map((c, i) => (
          <SectionReveal key={c.title} delay={0.12 + i * 0.05}>
            <div className="h-full rounded-md border border-line bg-surface p-5 transition-colors hover:border-ink-faint">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                {c.issuer}
              </p>
              <p className="mt-2 font-sans text-sm font-medium text-ink">{c.title}</p>
            </div>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
