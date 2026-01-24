"use client";

import { useEffect, useMemo, useState } from "react";
import type { ExamServiceEntry } from "@/lib/exams-curriculum";
import {
  topicProgressPercent,
  type CheckpointProgressResponse,
} from "@/lib/checkpoint-progress-types";
import { ServiceTopicCard } from "./service-topic-card";

type Props = {
  examId: string;
  services: ExamServiceEntry[];
  /** Show What/How/Why/Niche chips (preparation exam page) */
  showKnowledgeTier?: boolean;
};

export function ExamServiceTopicsGrid({ examId, services, showKnowledgeTier }: Props) {
  const [checkpointsByService, setCheckpointsByService] = useState<
    Record<string, { completed?: boolean; quizBestScore?: number }> | undefined
  >(undefined);
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/checkpoints", { credentials: "include" });
        if (cancelled) return;
        if (res.status === 401) {
          setSignedOut(true);
          setCheckpointsByService({});
          return;
        }
        if (!res.ok) {
          setCheckpointsByService({});
          return;
        }
        const data = (await res.json()) as CheckpointProgressResponse;
        const cps = data.checkpointProgress?.v1?.tracks?.[examId]?.checkpoints ?? {};
        setSignedOut(false);
        setCheckpointsByService(cps);
      } catch {
        if (!cancelled) setCheckpointsByService({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [examId]);

  const loading = checkpointsByService === undefined;

  const progressFor = useMemo(() => {
    return (serviceId: string) => {
      if (loading || signedOut) return 0;
      return topicProgressPercent(checkpointsByService?.[serviceId]);
    };
  }, [checkpointsByService, loading, signedOut]);

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {services.map((s) => (
        <li key={s.serviceId}>
          <ServiceTopicCard
            href={`/preparation/${examId}/${s.serviceId}`}
            label={s.label}
            hint={s.hint}
            iconFile={s.iconFile}
            knowledgeTier={showKnowledgeTier ? s.tier : undefined}
            progressPercent={progressFor(s.serviceId)}
            progressLoading={loading}
            trackProgressUnavailable={signedOut}
          />
        </li>
      ))}
    </ul>
  );
}
