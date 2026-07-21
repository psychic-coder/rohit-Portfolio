"use client";

import { useEffect, useRef } from "react";

/**
 * Signature element: an animated node-graph rendered on canvas.
 * Nodes drift slowly; edges connect near neighbors; the cursor exerts a gentle
 * repulsion field, and nodes near the cursor light up in the signal color —
 * a literal echo of CodeSage's graph retrieval and ShardRoute's sharded nodes.
 *
 * Degradation:
 *  - prefers-reduced-motion → one static frame, no animation loop.
 *  - coarse pointers / small screens → fewer nodes, no cursor field.
 */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export default function GraphVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const small = window.innerWidth < 768;

    const NODE_COUNT = small ? 28 : 64;
    const LINK_DIST = small ? 110 : 150;
    const CURSOR_RADIUS = 180;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const nodes: Node[] = [];

    function resize() {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 1.2 + Math.random() * 1.6,
        });
      }
    }

    function step() {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        // Cursor repulsion (desktop only)
        if (finePointer) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          const r2 = CURSOR_RADIUS * CURSOR_RADIUS;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = ((CURSOR_RADIUS - d) / CURSOR_RADIUS) * 0.35;
            n.x += (dx / d) * force;
            n.y += (dy / d) * force;
          }
        }

        // Soft wrap at edges
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.22;
            ctx.strokeStyle = `rgba(57,255,136,${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes — those near the cursor glow brighter
      for (const n of nodes) {
        const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const near = finePointer && d < CURSOR_RADIUS;
        ctx.fillStyle = near
          ? "rgba(57,255,136,0.95)"
          : "rgba(154,154,163,0.55)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? n.r + 0.8 : n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    }

    function onMouse(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    seed();

    if (reducedMotion) {
      // Single static frame — the structure is still visible, nothing moves.
      draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("resize", () => {
      resize();
      seed();
      if (reducedMotion) draw();
    });
    if (finePointer && !reducedMotion) {
      canvas.addEventListener("mousemove", onMouse);
      canvas.addEventListener("mouseleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
