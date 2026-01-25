"use client";

import { ExamServiceTopicsGrid } from "@/components/preparation/exam-service-topics-grid";
import { getExam } from "@/lib/exams-curriculum";

const SAA_EXAM_ID = "aws-solutions-architect-associate";

export function ServiceStrip() {
  const exam = getExam(SAA_EXAM_ID);
  if (!exam?.active) return null;

  return (
    <section className="border-y border-white/5 bg-zinc-950 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-zinc-500">
          Solutions Architect – Associate
        </p>
        <h2 className="mt-2 text-center font-sans text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Exam topic map & exploration
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-zinc-400">
          Tiles open a visual workspace + quiz. Signed-in users: progress follows your best score per topic.
        </p>
        <p className="sr-only">
          Grid of exam topics with icons, short hints, exploration percentage, and links to detailed preparation
          for each topic.
        </p>

        <div className="mt-10">
          <ExamServiceTopicsGrid examId={exam.id} services={exam.services} />
        </div>
      </div>
    </section>
  );
}
