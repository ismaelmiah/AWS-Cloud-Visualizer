"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { McqQuestion } from "@/lib/saa-quizzes";

type Props = {
  examId: string;
  serviceId: string;
  questions: McqQuestion[];
  open: boolean;
  onClose: () => void;
  contextTitle: string;
  contextSubtitle: string;
};

export function TopicQuizDialog({
  examId,
  serviceId,
  questions,
  open,
  onClose,
  contextTitle,
  contextSubtitle,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<{ scorePct: number; correct: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setChoices({});
    setSubmitted(null);
    setError(null);
    setSaving(false);
  }, [open, serviceId, examId]);

  const q = questions[step];
  const total = questions.length;
  const answeredThis = q ? Boolean(choices[q.id]) : false;
  const allAnswered = useMemo(
    () => questions.length > 0 && questions.every((qq) => choices[qq.id]),
    [choices, questions]
  );

  const pick = (optionId: string) => {
    if (!q) return;
    setSubmitted(null);
    setError(null);
    setChoices((c) => ({ ...c, [q.id]: optionId }));
  };

  const goNext = () => {
    if (step < total - 1) setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const submit = async () => {
    setError(null);
    if (!allAnswered) {
      setError("Answer every card before submitting.");
      return;
    }
    let correct = 0;
    for (const qq of questions) {
      if (choices[qq.id] === qq.correctOptionId) correct += 1;
    }
    const scorePct = Math.round((correct / questions.length) * 100);
    setSubmitted({ scorePct, correct, total: questions.length });
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

  const onDialogClose = () => {
    onClose();
  };

  return (
    <dialog
      ref={ref}
      onClose={onDialogClose}
      className="fixed left-1/2 top-1/2 z-[200] m-0 max-h-[min(90dvh,720px)] w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-zinc-950 p-0 text-zinc-100 shadow-2xl shadow-black/60 [&::backdrop]:bg-zinc-950/85"
    >
      <div className="max-h-[inherit] overflow-y-auto p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-sans text-lg font-semibold text-white">{contextTitle}</h2>
            {contextSubtitle ? (
              <p className="mt-1 text-xs leading-snug text-zinc-500">{contextSubtitle}</p>
            ) : null}
          </div>
          <form method="dialog">
            <button
              type="submit"
              className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-zinc-300 transition hover:border-white/25 hover:text-white"
            >
              Close
            </button>
          </form>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-zinc-500">
          <span className="font-mono tabular-nums">
            Card {Math.min(step + 1, Math.max(total, 1))} / {Math.max(total, 1)}
          </span>
          <span>{total} question{total === 1 ? "" : "s"}</span>
        </div>

        {q ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-900/60 p-4 sm:p-5">
            <p className="text-sm font-medium leading-relaxed text-zinc-100">{q.prompt}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt) => {
                const picked = choices[q.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => pick(opt.id)}
                    className={`rounded-xl border px-3 py-3 text-left text-sm transition ${
                      picked
                        ? "border-orange-500/60 bg-orange-500/15 text-orange-50"
                        : "border-white/10 bg-zinc-950/60 text-zinc-300 hover:border-white/20"
                    }`}
                  >
                    <span className="mr-2 font-mono text-xs text-zinc-500">{opt.id}.</span>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">No questions yet for this topic.</p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            {step < total - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!answeredThis}
                className="rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-100 transition hover:border-orange-500/70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next card
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void submit()}
                disabled={saving || questions.length === 0 || !allAnswered}
                className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:shadow-md hover:shadow-orange-900/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving…" : "Submit answers"}
              </button>
            )}
          </div>
          {submitted ? (
            <p className="text-sm text-zinc-300">
              Result: <span className="font-semibold text-orange-200">{submitted.scorePct}%</span> (
              {submitted.correct}/{submitted.total} correct)
            </p>
          ) : (
            <p className="text-xs text-zinc-600">Best score updates exploration % when signed in.</p>
          )}
        </div>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      </div>
    </dialog>
  );
}
