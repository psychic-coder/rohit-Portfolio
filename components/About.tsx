import SectionReveal from "./SectionReveal";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-wrap px-6 py-24">
      <SectionReveal>
        <p className="eyebrow">about</p>
        <div className="mt-6 grid gap-10 md:grid-cols-[2fr_1fr]">
          <div className="space-y-5 font-sans text-base leading-relaxed text-ink-dim">
            <p>
              I&apos;m a pre-final-year B.Tech Computer Science student at{" "}
              <span className="text-ink">Manipal University Jaipur</span> (graduating May
              2027), and most of what I build lives below the UI: rate limiters, retrieval
              pipelines, job queues, the parts of a system that decide whether it stays up.
            </p>
            <p>
              The through-line in my work is <span className="text-ink">failure as a design
              input</span>. ShardRoute exists because I wanted to know what my rate limiter
              does when Redis dies — so I killed Redis and measured it. CodeSage exists
              because vector search alone can&apos;t tell you what breaks when code changes —
              so I put a graph next to it. I&apos;d rather ship one system with a chaos-test
              report than five that have never been under load.
            </p>
            <p>
              Away from projects: developer tooling (I&apos;ve shipped VS Code and Eclipse
              extensions), and hands-on cloud infrastructure — I currently own EC2, RDS, S3
              and IAM setups directly at my internship.
            </p>
          </div>

          <dl className="h-fit space-y-4 rounded-md border border-line bg-surface p-6 font-mono text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-ink-faint">CGPA</dt>
              <dd className="mt-1 text-2xl font-bold text-signal">9.06</dd>
              <dd className="text-xs text-ink-dim">Dean&apos;s List</dd>
            </div>
            <div className="border-t border-line pt-4">
              <dt className="text-[10px] uppercase tracking-widest text-ink-faint">
                Hackathon
              </dt>
              <dd className="mt-1 text-ink">2nd Runner-Up</dd>
              <dd className="text-xs text-ink-dim">
                BITS Pilani × Postman API Hackathon 4.0
              </dd>
            </div>
            <div className="border-t border-line pt-4">
              <dt className="text-[10px] uppercase tracking-widest text-ink-faint">
                Graduating
              </dt>
              <dd className="mt-1 text-ink">May 2027</dd>
            </div>
          </dl>
        </div>
      </SectionReveal>
    </section>
  );
}
