"use client";

import { useEffect, useMemo, useState } from "react";
import { AWS_SOLUTIONS_ARCHITECT_ASSOCIATE_ID, type ExamServiceEntry } from "@/lib/exams-curriculum";
import {
  topicProgressPercent,
  type CheckpointProgressResponse,
} from "@/lib/checkpoint-progress-types";
import { saaC03DomainMeta, saaC03DomainOrder, type SaaC03DomainId } from "@/lib/saa-c03-domains";
import { ServiceTopicCard } from "./service-topic-card";

type Props = {
  examId: string;
  services: ExamServiceEntry[];
  /** Show What/How/Why/Niche chips when no SAA domain chips */
  showKnowledgeTier?: boolean;
};

const gridClass = "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

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

  const card = (s: ExamServiceEntry) => (
    <ServiceTopicCard
      href={`/preparation/${examId}/${s.serviceId}`}
      label={s.label}
      hint={s.hint}
      iconFile={s.iconFile}
      knowledgeTier={showKnowledgeTier ? s.tier : undefined}
      saaDomainChips={s.saaDomains?.length ? s.saaDomains : undefined}
      progressPercent={progressFor(s.serviceId)}
      progressLoading={loading}
      trackProgressUnavailable={signedOut}
    />
  );

  if (examId === AWS_SOLUTIONS_ARCHITECT_ASSOCIATE_ID) {
    return (
      <div className="space-y-12">
        {saaC03DomainOrder.map((domain: SaaC03DomainId) => {
          const list = services.filter((s) => s.saaDomains?.[0] === domain);
          if (!list.length) return null;
          const meta = saaC03DomainMeta[domain];
          return (
            <section key={domain} className="scroll-mt-4">
              <div className="flex flex-wrap items-end justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h2 className="font-sans text-lg font-semibold tracking-tight text-white">{meta.label}</h2>
                  <p className="mt-1 max-w-3xl text-sm text-zinc-500">{meta.oneLiner}</p>
                </div>
                <span className="font-mono text-sm tabular-nums text-zinc-500">{meta.percent}% of exam</span>
              </div>
              <ul className={`mt-5 ${gridClass}`}>
                {list.map((s) => (
                  <li key={s.serviceId}>{card(s)}</li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <ul className={gridClass}>
      {services.map((s) => (
        <li key={s.serviceId}>{card(s)}</li>
      ))}
    </ul>
  );
}
