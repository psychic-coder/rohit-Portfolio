import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import StatCounter from "@/components/StatCounter";
import SectionReveal from "@/components/SectionReveal";
import MagneticButton from "@/components/MagneticButton";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.kicker}`,
    description: project.summary,
  };
}

export default function ProjectPage({ params }: Props) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const isLive = project.liveUrl !== "#";

  return (
    <article className="mx-auto max-w-wrap px-6 pb-24 pt-32">
      <SectionReveal>
        <Link
          href="/#projects"
          className="font-mono text-xs text-ink-dim transition-colors hover:text-signal"
        >
          ← all projects
        </Link>

        <p className="eyebrow mt-8">{project.kicker}</p>
        <h1 className="mt-4 font-mono text-4xl font-bold text-ink md:text-5xl">
          {project.title}
        </h1>
        <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-ink-dim">
          {project.summary}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <MagneticButton href={project.github} external>
            View on GitHub
          </MagneticButton>
          {isLive ? (
            <MagneticButton href={project.liveUrl} external variant="solid">
              Live demo
            </MagneticButton>
          ) : (
            <span className="inline-flex items-center rounded-md border border-line px-5 py-2.5 font-mono text-sm text-ink-faint">
              {project.liveUrlNote ?? "Live deploy pending"}
            </span>
          )}
        </div>
      </SectionReveal>

      {project.metrics.length > 0 && (
        <SectionReveal delay={0.1}>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.metrics.map((m) => (
              <StatCounter key={m.label} metric={m} />
            ))}
          </div>
        </SectionReveal>
      )}

      <SectionReveal delay={0.15}>
        <h2 className="mt-16 font-mono text-xl font-bold text-ink">The problem</h2>
        <p className="mt-4 max-w-3xl font-sans text-base leading-relaxed text-ink-dim">
          {project.problem}
        </p>
      </SectionReveal>

      <SectionReveal delay={0.2}>
        <h2 className="mt-14 font-mono text-xl font-bold text-ink">
          Architecture &amp; approach
        </h2>
        {/*
          TODO: drop an architecture diagram here once exported, e.g.:
          <Image src={`/diagrams/${project.slug}.svg`} alt={`${project.title} architecture`} … />
        */}
        <ol className="mt-6 max-w-3xl space-y-5 border-l border-line">
          {project.architecture.map((step, i) => (
            <li key={i} className="relative pl-8">
              <span
                aria-hidden="true"
                className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-signal/60"
              />
              <p className="font-sans text-sm leading-relaxed text-ink-dim">{step}</p>
            </li>
          ))}
        </ol>
      </SectionReveal>

      <SectionReveal delay={0.25}>
        <h2 className="mt-14 font-mono text-xl font-bold text-ink">Stack</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li
              key={s}
              className="rounded border border-line bg-surface px-3 py-1.5 font-mono text-xs text-ink-dim"
            >
              {s}
            </li>
          ))}
        </ul>
      </SectionReveal>
    </article>
  );
}
