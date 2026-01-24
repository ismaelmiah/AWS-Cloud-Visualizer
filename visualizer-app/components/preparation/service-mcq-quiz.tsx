"use client";

import { useMemo, useState } from "react";
import type { McqQuestion } from "@/lib/saa-quizzes";

type Props = {
  examId: string;
  serviceId: string;
  questions: McqQuestion[];
};

export function ServiceMcqQuiz({ examId, serviceId, questions }: Props) {
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<{
    scorePct: number;
    correct: number;
    total: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const allAnswered = useMemo(
    () => questions.length > 0 && questions.every((q) => choices[q.id]),
    [choices, questions]
  );

  const select = (questionId: string, optionId: string) => {
    setSubmitted(null);
    setError(null);
    setChoices((c) => ({ ...c, [questionId]: optionId }));
  };

  const submit = async () => {
    setError(null);
    if (!allAnswered) {
      setError("Answer every question before submitting.");
      return;
    }
    let correct = 0;
    for (const q of questions) {
      if (choices[q.id] === q.correctOptionId) correct += 1;
    }
    const total = questions.length;
    const scorePct = Math.round((correct / total) * 100);
    setSubmitted({ scorePct, correct, total });
    setSaving(true);
    try {
      const res = await fetch("/api/checkpoints", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId: examId,
          checkpointId: serviceId,
          quizBestScore: scorePct,
        }),
      });
      if (res.status === 401) {
        setError("Sign in to save your score to your profile.");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(typeof body.error === "string" ? body.error : "Could not save score.");
        return;
      }
    } catch {
      setError("Network error while saving score.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 sm:p-5">
      <h2 className="font-sans text-lg font-semibold text-white">Topic quiz</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Your best score updates exploration % for this topic (stored when signed in).
      </p>

      <ol className="mt-6 space-y-8">
        {questions.map((q, idx) => (
          <li key={q.id} className="list-inside">
            <p className="text-sm font-medium text-zinc-200">
              <span className="mr-2 font-mono text-zinc-500">{idx + 1}.</span>
              {q.prompt}
            </p>
            <ul className="mt-3 space-y-2 pl-0 sm:pl-6">
              {q.options.map((opt) => {
                const picked = choices[q.id] === opt.id;
                return (
                  <li key={opt.id}>
                    <button
                      type="button"
                      onClick={() => select(q.id, opt.id)}
                      className={`flex w-full rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                        picked
                          ? "border-orange-500/60 bg-orange-500/15 text-orange-50"
                          : "border-white/10 bg-zinc-950/60 text-zinc-300 hover:border-white/20"
                      }`}
                    >
                      <span className="mr-2 font-mono text-xs text-zinc-500">{opt.id}.</span>
                      {opt.text}
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => void submit()}
          disabled={saving || questions.length === 0}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-zinc-950 transition hover:shadow-md hover:shadow-orange-900/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Submit answers"}
        </button>
        {submitted ? (
          <p className="text-sm text-zinc-300">
            Result: <span className="font-semibold text-orange-200">{submitted.scorePct}%</span> (
            {submitted.correct}/{submitted.total} correct)
          </p>
        ) : null}
      </div>
      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
    </section>
  );
}
