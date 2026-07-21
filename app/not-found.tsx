import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-6xl font-bold text-signal">404</p>
      <p className="mt-4 font-mono text-sm text-ink-dim">
        Route not found. Fail-open engaged — here&apos;s the way back.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md border border-line px-5 py-2.5 font-mono text-sm text-ink transition-colors hover:border-signal hover:text-signal"
      >
        ← back home
      </Link>
    </div>
  );
}
