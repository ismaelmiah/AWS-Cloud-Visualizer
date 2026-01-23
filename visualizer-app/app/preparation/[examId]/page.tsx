import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExam, programTierMeta, tierSummary } from "@/lib/exams-curriculum";

type Props = {
  params: Promise<{ examId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { examId } = await params;
  const exam = getExam(examId);
  if (!exam) return { title: "Exam not found" };
  return {
    title: `${exam.title} — Preparation`,
    description: exam.tagline,
  };
}

export default async function PreparationExamGridPage({ params }: Props) {
  const { examId } = await params;
  const exam = getExam(examId);
  if (!exam) notFound();
  if (!exam.active) notFound();

  const tier = programTierMeta[exam.certificationTier];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/preparation"
            className="text-sm font-medium text-orange-400/90 transition hover:text-orange-300"
          >
            ← Exam menu
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tier.badgeClass}`}
            >
              {tier.label}
            </span>
            <span className="text-xs font-medium text-zinc-500">{tier.simpleGoal}</span>
          </div>
          <h1 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {exam.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">{exam.tagline}</p>
          <p className="mt-2 text-xs text-zinc-500">
            <span className="font-medium text-zinc-400">Who:</span> {exam.targetAudience}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            <span className="font-medium text-zinc-400">Focus:</span> {exam.knowledgeProfile}
          </p>
        </div>
      </div>

      <p className="mt-8 text-xs font-medium uppercase tracking-widest text-zinc-500">
        Knowledge depth per service
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-400">
        <li>
          <span className="font-medium text-sky-300">What</span> — name &amp; role
        </li>
        <li className="text-zinc-600">·</li>
        <li>
          <span className="font-medium text-amber-300">How</span> — fit &amp; flow
        </li>
        <li className="text-zinc-600">·</li>
        <li>
          <span className="font-medium text-orange-300">Why</span> — tradeoffs &amp; design
        </li>
        <li className="text-zinc-600">·</li>
        <li>
          <span className="font-medium text-violet-300">Niche</span> — domain-deep (Specialty)
        </li>
      </ul>

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {exam.services.map((s) => {
          const cell = tierSummary[s.tier];
          return (
            <li key={s.serviceId}>
              <div
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-zinc-900/60 p-4 transition hover:border-white/20"
                title={`${s.label} — ${cell.blurb}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <Image
                    src={`/aws-icons/${s.iconFile}`}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                    aria-hidden
                  />
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cell.className}`}
                  >
                    {cell.short}
                  </span>
                </div>
                <p className="mt-3 font-mono text-sm font-semibold text-zinc-100">{s.label}</p>
                <p className="mt-1 text-xs text-zinc-500">{s.hint}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
