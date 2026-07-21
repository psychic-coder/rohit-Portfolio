"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { navSections, site } from "@/data/site";
import { projects } from "@/data/projects";

interface Command {
  label: string;
  hint: string;
  run: () => void;
}

/** Cmd+K / Ctrl+K palette to jump around the site. */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const goToSection = useCallback(
    (id: string) => {
      if (pathname !== "/") {
        router.push(`/#${id}`);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [pathname, router],
  );

  const commands: Command[] = [
    ...navSections.map((s) => ({
      label: `Go to ${s.label}`,
      hint: "section",
      run: () => goToSection(s.id),
    })),
    ...projects.map((p) => ({
      label: `Open ${p.title}`,
      hint: "case study",
      run: () => router.push(`/projects/${p.slug}`),
    })),
    {
      label: "Copy email",
      hint: site.email,
      run: () => navigator.clipboard?.writeText(site.email),
    },
    {
      label: "Open GitHub",
      hint: "psychic-coder",
      run: () => window.open(site.github, "_blank", "noopener"),
    },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setIndex(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[index]) {
      filtered[index].run();
      setOpen(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-base/80 pt-[18vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg overflow-hidden rounded-lg border border-line bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-line px-4">
              <span className="font-mono text-signal">&gt;</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Jump to…"
                aria-label="Search commands"
                className="w-full bg-transparent py-3 font-mono text-sm text-ink placeholder:text-ink-faint focus:outline-none"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
                esc
              </kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto py-1">
              {filtered.length === 0 && (
                <li className="px-4 py-3 font-mono text-sm text-ink-faint">
                  No matches. Try a section or project name.
                </li>
              )}
              {filtered.map((c, i) => (
                <li key={c.label}>
                  <button
                    onClick={() => {
                      c.run();
                      setOpen(false);
                    }}
                    onMouseEnter={() => setIndex(i)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-mono text-sm ${
                      i === index ? "bg-raised text-signal" : "text-ink-dim"
                    }`}
                  >
                    <span>{c.label}</span>
                    <span className="text-[10px] text-ink-faint">{c.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
