import Link from "next/link";
import SectionReveal from "./SectionReveal";
import { projects, type Project } from "@/data/projects";

const statusLabel: Record<Project["status"], string> = {
  shipped: "chaos-tested",
  "in-progress": "in progress",
  "systems-design": "systems design / R&D",
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const featured = index === 0; // first project gets hero-level treatment
  return (
    <SectionReveal delay={index * 0.06} className={featured ? "md:col-span-2" : ""}>
      <Link
        href={`/projects/${project.slug}`}
        className="group block h-full rounded-lg border border-line bg-surface p-7 transition-colors hover:border-signal/50 hover:bg-raised"
      >
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
            {project.kicker}
          </p>
          <span
            className={`shrink-0 rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
              project.status === "shipped"
                ? "border-chaos/30 bg-chaos-dim text-chaos"
                : "border-line text-ink-faint"
            }`}
          >
            {statusLabel[project.status]}
          </span>
        </div>

        <h3
          className={`mt-3 font-mono font-bold text-ink transition-colors group-hover:text-signal ${
            featured ? "text-3xl md:text-4xl" : "text-2xl"
          }`}
        >
          {project.title}
        </h3>

        <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-ink-dim">
          {project.summary}
        </p>

        {project.metrics.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
            {project.metrics.map((m) => (
              <span
                key={m.label}
                className={m.tone === "chaos" ? "text-chaos" : "text-signal"}
              >
                {m.prefix}
                {m.value}
                {m.suffix}{" "}
                <span className="text-ink-faint">{m.label}</span>
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-2">
            {project.stack.slice(0, featured ? 8 : 5).map((s) => (
              <li
                key={s}
                className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-ink-dim"
              >
                {s}
              </li>
            ))}
          </ul>
          <span className="font-mono text-xs text-signal opacity-0 transition-opacity group-hover:opacity-100">
            read case study →
          </span>
        </div>
      </Link>
    </SectionReveal>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-wrap px-6 py-24">
      <SectionReveal>
        <p className="eyebrow">projects</p>
        <h2 className="mt-4 font-mono text-2xl font-bold text-ink md:text-3xl">
          Built, measured, and broken on purpose
        </h2>
        <p className="mt-3 max-w-2xl font-sans text-sm text-ink-dim">
          Every number below comes from an actual test run — nothing is estimated.
        </p>
      </SectionReveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
