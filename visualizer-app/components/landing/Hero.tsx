"use client";

import { SignUpButton } from "@clerk/nextjs";

export function Hero() {
  return (
    <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8">
      <div className="pointer-events-none absolute inset-0 landing-hero-bg" aria-hidden />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-orange-500/20 blur-[100px] landing-orb-a" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-sky-500/15 blur-[90px] landing-orb-b" />

      <div className="relative mx-auto max-w-5xl text-center">
        <p className="landing-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Built for AWS certification paths
        </p>

        <h1 className="landing-fade-in landing-fade-in-delay-1 font-sans text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
          Learn AWS through{" "}
          <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">
            visualization
          </span>
          , not walls of text
        </h1>

        <p className="landing-fade-in landing-fade-in-delay-2 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
          Follow visual checkpoints for core services—ideal for{" "}
          <strong className="font-medium text-zinc-200">AWS Cloud Practitioner</strong> and beyond.
          Short diagrams, step-by-step flows, then a quick quiz to lock in what you saw.
        </p>

        <div className="landing-fade-in landing-fade-in-delay-3 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <SignUpButton mode="modal">
            <button
              type="button"
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-3.5 text-base font-semibold text-zinc-950 shadow-lg shadow-orange-500/25 transition hover:shadow-orange-500/40 sm:w-auto"
            >
              <span className="relative z-10">Start learning free</span>
              <span className="absolute inset-0 -translate-x-full bg-white/25 transition group-hover:translate-x-0 duration-500 ease-out" />
            </button>
          </SignUpButton>
          <a
            href="#how-it-works"
            className="w-full rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-base font-medium text-zinc-100 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/10 sm:w-auto"
          >
            See how it works
          </a>
        </div>

        <div className="landing-fade-in landing-fade-in-delay-4 mt-20 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Visual first", sub: "Diagrams over docs" },
            { label: "Checkpoint paths", sub: "One service at a time" },
            { label: "Quiz gates", sub: "Recall after each step" },
          ].map((item) => (
            <div
              key={item.label}
              className="landing-float-card rounded-2xl border border-white/10 bg-zinc-900/40 p-5 text-left backdrop-blur-md"
            >
              <p className="font-medium text-zinc-100">{item.label}</p>
              <p className="mt-1 text-sm text-zinc-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
