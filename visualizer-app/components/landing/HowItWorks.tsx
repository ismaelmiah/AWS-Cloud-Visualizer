import { Reveal } from "./Reveal";

const steps = [
  {
    step: "01",
    title: "Visualize",
    body: "Each checkpoint opens with a clear diagram: how the service fits in a real flow. Less reading, more pattern recognition.",
    accent: "from-sky-500/30 to-cyan-500/10",
  },
  {
    step: "02",
    title: "Checkpoint",
    body: "Move step by step through the concepts that show up on the exam—IAM, VPC, S3, billing, and the rest—in bite-sized beats.",
    accent: "from-orange-500/30 to-amber-500/10",
  },
  {
    step: "03",
    title: "Quiz",
    body: "After each checkpoint, a short quiz checks recall. Pass the gate before you unlock the next visualization path.",
    accent: "from-emerald-500/30 to-teal-500/10",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-white/5 bg-zinc-950/80 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center font-sans text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            How your study path works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-400">
            Three beats repeat until the domain clicks: see it, walk it, prove it.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.step} delayMs={i * 100}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-8 transition hover:border-white/20">
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${s.accent} blur-2xl transition group-hover:opacity-100 opacity-70`}
                />
                <span className="font-mono text-xs font-medium uppercase tracking-widest text-zinc-500">
                  {s.step}
                </span>
                <h3 className="mt-3 font-sans text-xl font-semibold text-white">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{s.body}</p>
                <div className="mt-6 h-px w-12 bg-gradient-to-r from-orange-400 to-transparent" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
