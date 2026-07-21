"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface Props {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  download?: boolean;
  external?: boolean;
}

/** A link styled as a button that leans toward the cursor. Disabled under reduced motion. */
export default function MagneticButton({
  href,
  children,
  variant = "ghost",
  download,
  external,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  function onMove(e: React.MouseEvent) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.25);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.25);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const styles =
    variant === "solid"
      ? "bg-signal text-base hover:bg-signal/90"
      : "border border-line text-ink hover:border-signal hover:text-signal";

  return (
    <motion.a
      ref={ref}
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`inline-flex items-center gap-2 rounded-md px-5 py-2.5 font-mono text-sm transition-colors ${styles}`}
    >
      {children}
    </motion.a>
  );
}
