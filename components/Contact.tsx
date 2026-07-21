import SectionReveal from "./SectionReveal";
import MagneticButton from "./MagneticButton";
import { site } from "@/data/site";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-wrap px-6 py-24">
      <SectionReveal>
        <p className="eyebrow">contact</p>
        <h2 className="mt-4 max-w-2xl font-mono text-3xl font-bold leading-tight text-ink md:text-4xl">
          Building something that needs to{" "}
          <span className="text-signal">stay up under load</span>? Let&apos;s talk.
        </h2>
        <p className="mt-4 max-w-xl font-sans text-sm text-ink-dim">
          Open to internships and engineering roles in backend, infra, and AI systems.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <MagneticButton href={`mailto:${site.email}`} variant="solid">
            {site.email}
          </MagneticButton>
          <MagneticButton href={site.github} external>
            GitHub
          </MagneticButton>
          {/* TODO: replace "#" with your LinkedIn URL in data/site.ts */}
          <MagneticButton href={site.linkedin} external>
            LinkedIn
          </MagneticButton>
          <MagneticButton href={site.resume} download>
            Resume (PDF)
          </MagneticButton>
        </div>
      </SectionReveal>

      <footer className="mt-24 border-t border-line pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-ink-faint">
          <span>
            © {new Date().getFullYear()} {site.name} · rohitganguly.dev
          </span>
          <span>
            Designed &amp; built by hand · Next.js + Tailwind + Framer Motion
          </span>
        </div>
      </footer>
    </section>
  );
}
