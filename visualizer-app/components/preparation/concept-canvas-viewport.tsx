"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const VIEW_VERSION = 2;

type StoredView = {
  v: typeof VIEW_VERSION;
  scale: number;
  tx: number;
  ty: number;
};

function viewStorageKey(examId: string, serviceId: string) {
  return `viz:concept-view:${VIEW_VERSION}:${examId}:${serviceId}`;
}

function loadView(examId: string, serviceId: string): Pick<StoredView, "scale" | "tx" | "ty"> {
  if (typeof window === "undefined") return { scale: 1, tx: 0, ty: 0 };
  try {
    const raw = window.localStorage.getItem(viewStorageKey(examId, serviceId));
    if (!raw) return { scale: 1, tx: 0, ty: 0 };
    const p = JSON.parse(raw) as StoredView;
    if (p?.v !== VIEW_VERSION) return { scale: 1, tx: 0, ty: 0 };
    return {
      scale: typeof p.scale === "number" && p.scale > 0 ? Math.min(2.4, Math.max(0.45, p.scale)) : 1,
      tx: typeof p.tx === "number" ? p.tx : 0,
      ty: typeof p.ty === "number" ? p.ty : 0,
    };
  } catch {
    return { scale: 1, tx: 0, ty: 0 };
  }
}

function saveView(examId: string, serviceId: string, scale: number, tx: number, ty: number) {
  if (typeof window === "undefined") return;
  const payload: StoredView = { v: VIEW_VERSION, scale, tx, ty };
  window.localStorage.setItem(viewStorageKey(examId, serviceId), JSON.stringify(payload));
}

type Props = {
  examId: string;
  serviceId: string;
  children: React.ReactNode;
  className?: string;
};

export function ConceptCanvasViewport({ examId, serviceId, children, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [{ scale, tx, ty }, setView] = useState({ scale: 1, tx: 0, ty: 0 });
  const panRef = useRef<{ px: number; py: number; tx0: number; ty0: number; s0: number } | null>(null);

  useEffect(() => {
    const v = loadView(examId, serviceId);
    setView(v);
  }, [examId, serviceId]);

  const persist = useCallback(
    (next: { scale: number; tx: number; ty: number }) => {
      setView(next);
      saveView(examId, serviceId, next.scale, next.tx, next.ty);
    },
    [examId, serviceId]
  );

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    const nextScale = Math.min(2.4, Math.max(0.45, scale + delta));
    persist({ scale: nextScale, tx, ty });
  };

  const reset = () => persist({ scale: 1, tx: 0, ty: 0 });

  const startPan = (ev: React.PointerEvent) => {
    if (ev.button !== 1 && !ev.altKey) return;
    ev.preventDefault();
    const s0 = scale;
    panRef.current = { px: ev.clientX, py: ev.clientY, tx0: tx, ty0: ty, s0 };
    const onMove = (e: PointerEvent) => {
      const p = panRef.current;
      if (!p) return;
      persist({
        scale: p.s0,
        tx: p.tx0 + (e.clientX - p.px),
        ty: p.ty0 + (e.clientY - p.py),
      });
    };
    const onUp = () => {
      panRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div
      ref={wrapRef}
      className={`relative touch-none ${className ?? ""}`}
      onWheel={onWheel}
      onPointerDown={startPan}
    >
      <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-wrap items-center gap-1">
        <span className="pointer-events-auto flex rounded-lg border border-white/10 bg-zinc-950/90 p-0.5 shadow">
          <button
            type="button"
            onClick={() => persist({ scale: Math.max(0.45, scale - 0.12), tx, ty })}
            className="rounded-md px-2 py-1 text-xs font-semibold text-zinc-200 hover:bg-white/10"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md px-2 py-1 text-xs font-semibold text-zinc-400 hover:bg-white/10"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => persist({ scale: Math.min(2.4, scale + 0.12), tx, ty })}
            className="rounded-md px-2 py-1 text-xs font-semibold text-zinc-200 hover:bg-white/10"
            aria-label="Zoom in"
          >
            +
          </button>
        </span>
        <span className="pointer-events-none rounded bg-zinc-950/80 px-2 py-0.5 text-[10px] text-zinc-500">
          Wheel zoom · Alt-drag or middle-drag pan
        </span>
      </div>
      <div
        className="flex min-h-[min(480px,70vh)] w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-950/90 pt-10"
        style={{ touchAction: "none" }}
      >
        <div
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
