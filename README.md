# rohitganguly.dev

Dark-mode-first portfolio — Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion.

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

Production build check (do this before deploying):

```bash
npm run build
npm start
```

## Where content lives

All copy/data is in `data/` — you never touch layout code to edit content:

| File | What it controls |
|---|---|
| `data/site.ts` | Name, email, GitHub, LinkedIn, resume path, tagline |
| `data/projects.ts` | Project cards **and** full case-study pages (`/projects/[slug]`) |
| `data/experience.ts` | Experience timeline |
| `data/skills.ts` | Skills grid categories |
| `data/certifications.ts` | Certifications + hackathon achievement |

## Still to plug in (search the codebase for `TODO:`)

- [ ] `public/resume.pdf` — resume download button points at `/resume.pdf`
- [ ] LinkedIn URL in `data/site.ts` (currently `#`)
- [ ] Internship company name + date ranges in `data/experience.ts`
- [ ] Live project URLs in `data/projects.ts` once deployed
      (`shardroute.` / `devpulse.` / `codesage.rohitganguly.dev` — currently `#`, and the
      case-study page renders an honest "Live deploy pending" chip instead of a dead link)
- [ ] `public/og.png` (1200×630) — then uncomment the `images` line in `app/layout.tsx`
- [ ] Architecture diagrams per project — a marked slot exists in
      `app/projects/[slug]/page.tsx`; export SVGs to `public/diagrams/<slug>.svg`
- [ ] Demo GIFs/videos if you want them on case-study pages

## Design system

- **Colors** (all in `tailwind.config.ts`, default palette removed):
  `base #0A0A0B` · `surface #0D0D10` · `signal #39FF88` (links/hover/graph) ·
  `chaos #FFB454` (**reserved for latency & chaos-test metrics only**)
- **Type**: JetBrains Mono (headings/metrics) + Inter (body), loaded via `next/font`
- **Signature element**: `components/GraphVisual.tsx` — canvas node-graph in the hero
  with cursor repulsion. Falls back to fewer nodes on mobile and a static frame under
  `prefers-reduced-motion`. Lazy-loaded (`next/dynamic`, `ssr: false`).

## Accessibility & performance notes

- Reduced-motion is respected everywhere (canvas, counters, reveals, magnetic buttons,
  custom cursor).
- Custom cursor only mounts on fine pointers; keyboard focus rings are always visible.
- Skip link, semantic landmarks, `aria` on the command palette and skills tabs.
- Hero canvas is capped at 2× DPR and lazy-loaded; fonts are self-hosted via `next/font`.

## Deploying to Vercel

Push to GitHub → import in Vercel → add `rohitganguly.dev` as the domain. Project
subdomains (`shardroute.rohitganguly.dev`, etc.) can be separate Vercel projects later;
the case-study pages already have the link slots waiting.

## Easter egg

`Cmd+K` / `Ctrl+K` opens a command palette (sections, case studies, copy email, GitHub).
