"use client";

import Link from "next/link";
import { navSections } from "@/data/site";

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-base/75 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-wrap items-center justify-between px-6 py-3"
      >
        <Link
          href="/"
          className="font-mono text-sm text-ink transition-colors hover:text-signal"
        >
          <span className="text-signal">~/</span>rohitganguly.dev
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {navSections.map((s) => (
            <li key={s.id}>
              <Link
                href={`/#${s.id}`}
                className="font-mono text-xs uppercase tracking-widest text-ink-dim transition-colors hover:text-signal"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>

        <span className="hidden font-mono text-[10px] text-ink-faint lg:block">
          <kbd className="rounded border border-line px-1.5 py-0.5">⌘K</kbd> to jump
        </span>
      </nav>
    </header>
  );
}
