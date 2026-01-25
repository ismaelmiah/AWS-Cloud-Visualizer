"use client";

import { useState } from "react";
import { ServiceConceptGraph } from "@/components/preparation/service-concept-graph";
import { ServiceDiagramCanvas } from "@/components/preparation/service-diagram-canvas";
import { TopicQuizDialog } from "@/components/preparation/topic-quiz-dialog";
import { getServiceConceptSpec } from "@/lib/saa-service-concepts";
import { getDiagramLabelsForService } from "@/lib/service-diagram-palettes";
import type { McqQuestion } from "@/lib/saa-quizzes";

type Props = {
  examId: string;
  serviceId: string;
  serviceLabel: string;
  questions: McqQuestion[];
};

export function PreparationServiceBody({ examId, serviceId, serviceLabel, questions }: Props) {
  const chips = getDiagramLabelsForService(serviceId);
  const conceptSpec = getServiceConceptSpec(serviceId, serviceLabel, chips);

  const [quizOpen, setQuizOpen] = useState(false);
  const [quizCtx, setQuizCtx] = useState({ title: "", subtitle: "" });

  const openQuiz = (title: string, subtitle: string) => {
    setQuizCtx({ title, subtitle });
    setQuizOpen(true);
  };

  return (
    <div className="mt-10 flex flex-col gap-6">
      <div className="relative">
        {conceptSpec ? (
          <ServiceConceptGraph
            spec={conceptSpec}
            examId={examId}
            serviceId={serviceId}
            onPracticeAngle={openQuiz}
          />
        ) : (
          <ServiceDiagramCanvas examId={examId} serviceId={serviceId} />
        )}

        <button
          type="button"
          onClick={() => openQuiz(`Quiz · ${serviceLabel}`, `${questions.length} cards · best score updates progress when signed in.`)}
          className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 text-xs font-bold text-zinc-950 shadow-lg shadow-black/40 transition hover:border-orange-400/80"
        >
          Quiz
          <span className="rounded-full bg-zinc-950/25 px-1.5 py-0.5 font-mono tabular-nums">{questions.length}</span>
        </button>
      </div>

      <TopicQuizDialog
        examId={examId}
        serviceId={serviceId}
        questions={questions}
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        contextTitle={quizCtx.title}
        contextSubtitle={quizCtx.subtitle}
      />
    </div>
  );
}
