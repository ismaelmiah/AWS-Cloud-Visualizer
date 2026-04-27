import type { Metadata } from "next";
import Link from "next/link";
import { listExams, programTierMeta } from "@/lib/exams-curriculum";

export const metadata: Metadata = {
  title: "Preparation — AWS Visualizer",
  description: "Choose a certification track to open your service map.",
};

export default function PreparationHubPage() {
  const exams = listExams();

  return (
    <div>
      <h1 className="font-sans text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Choose your exam
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
        Cards are ordered by program level (Foundational through Specialty). Each track shows who it is
        for, what kind of thinking the exam rewards, and a curated service map with depth chips.
      </p>

      <div className="mt-8 rounded-2xl border border-orange-500/25 bg-zinc-900/60 p-5 shadow-md shadow-black/20">
        <h2 className="font-sans text-lg font-semibold text-white">Architecture lab</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Practice core services on a free-form canvas, connect them into flows, export PDF or PNG, and copy
          a shareable link. Named designs and diagrams are stored in Supabase per user; the link can also
          embed a compressed copy for sharing.
        </p>
        <Link
          href="/preparation/architect"
          className="mt-4 inline-flex items-center justify-center rounded-full border border-orange-500/50 bg-orange-500/10 px-5 py-2.5 text-sm font-semibold text-orange-200 transition hover:bg-orange-500/20"
        >
          Open architecture lab
        </Link>
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {exams.map((exam) => {
          const tier = programTierMeta[exam.certificationTier];
          return (
            <li key={exam.id}>
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-zinc-900/50 p-6 shadow-lg shadow-black/20 transition hover:border-orange-500/35 hover:bg-zinc-900/80">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tier.badgeClass}`}
                  >
                    {tier.label}
                  </span>
                  {!exam.active ? (
                    <span className="rounded-full border border-zinc-600 bg-zinc-800/80 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400">
                      Coming soon
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-3 font-sans text-lg font-semibold text-white">{exam.title}</h2>
                <p className="mt-1 text-xs font-medium text-zinc-500">{tier.simpleGoal}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{exam.tagline}</p>
                <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                  <span className="font-medium text-zinc-400">Who:</span> {exam.targetAudience}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                  <span className="font-medium text-zinc-400">Focus:</span> {exam.knowledgeProfile}
                </p>
                <p className="mt-3 text-xs text-zinc-600">
                  {exam.services.length} services in map · {exam.simpleGoalSummary}
                </p>
                {exam.active ? (
                  <Link
                    href={`/preparation/${exam.id}`}
                    className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:shadow-md hover:shadow-orange-900/30"
                  >
                    View service map
                  </Link>
                ) : (
                  <span className="mt-6 inline-flex w-fit cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-zinc-800/60 px-5 py-2.5 text-sm font-medium text-zinc-500">
                    Curriculum in progress
                  </span>
                )}
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
