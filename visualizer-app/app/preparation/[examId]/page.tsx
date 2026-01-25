import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExamServiceTopicsGrid } from "@/components/preparation/exam-service-topics-grid";
import { SaaDomainStrip } from "@/components/preparation/saa-domain-strip";
import { AWS_SOLUTIONS_ARCHITECT_ASSOCIATE_ID, getExam, programTierMeta } from "@/lib/exams-curriculum";

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
          {exam.id === AWS_SOLUTIONS_ARCHITECT_ASSOCIATE_ID ? (
            <details className="mt-3 max-w-2xl rounded-lg border border-white/10 bg-zinc-900/40 px-3 py-2 text-xs text-zinc-500">
              <summary className="cursor-pointer font-medium text-zinc-400">Audience &amp; focus</summary>
              <p className="mt-2">
                <span className="font-medium text-zinc-400">Who:</span> {exam.targetAudience}
              </p>
              <p className="mt-1">
                <span className="font-medium text-zinc-400">Focus:</span> {exam.knowledgeProfile}
              </p>
            </details>
          ) : (
            <>
              <p className="mt-2 text-xs text-zinc-500">
                <span className="font-medium text-zinc-400">Who:</span> {exam.targetAudience}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                <span className="font-medium text-zinc-400">Focus:</span> {exam.knowledgeProfile}
              </p>
            </>
          )}
        </div>
      </div>

      {exam.id === AWS_SOLUTIONS_ARCHITECT_ASSOCIATE_ID ? (
        <>
          <p className="mt-8 text-xs font-medium uppercase tracking-widest text-zinc-500">SAA-C03 domains</p>
          <SaaDomainStrip />
          <p className="mt-4 text-xs text-zinc-500">
            Tiles are grouped by primary domain. Letters on each tile:{" "}
            <span className="font-mono text-zinc-400">S</span> secure,{" "}
            <span className="font-mono text-zinc-400">R</span> resilient,{" "}
            <span className="font-mono text-zinc-400">H</span> high-performing,{" "}
            <span className="font-mono text-zinc-400">C</span> cost-optimized.
          </p>
        </>
      ) : (
        <>
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
        </>
      )}

      <div className="mt-8">
        <ExamServiceTopicsGrid
          examId={exam.id}
          services={exam.services}
          showKnowledgeTier={exam.id !== AWS_SOLUTIONS_ARCHITECT_ASSOCIATE_ID}
        />
      </div>
    </div>
  );
}
