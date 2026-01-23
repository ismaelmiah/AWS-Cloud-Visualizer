import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-zinc-950 px-6 py-16 text-center text-zinc-100">
      <p className="font-mono text-sm font-medium uppercase tracking-widest text-zinc-500">404</p>
      <h1 className="mt-3 font-sans text-2xl font-semibold tracking-tight sm:text-3xl">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-zinc-400">
        This URL does not match any route in the app. Check the address or go back to a known area.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/preparation"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-zinc-950 transition hover:shadow-md hover:shadow-orange-900/30"
        >
          Preparation
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-white/25 hover:bg-white/5"
        >
          Marketing home
        </Link>
      </div>
    </div>
  );
}
