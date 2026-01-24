"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDiagramLabelsForService } from "@/lib/service-diagram-palettes";

type DiagramNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

const STORAGE_VERSION = 1;

type StoredDiagram = {
  v: typeof STORAGE_VERSION;
  nodes: Pick<DiagramNode, "id" | "x" | "y">[];
};

function storageKey(examId: string, serviceId: string) {
  return `viz:diagram-positions:${examId}:${serviceId}`;
}

function buildInitialNodes(serviceId: string): DiagramNode[] {
  const labels = getDiagramLabelsForService(serviceId);
  return labels.map((label, i) => ({
    id: `chip-${i}`,
    label,
    x: 20 + (i % 2) * 140,
    y: 20 + Math.floor(i / 2) * 56,
  }));
}

function loadStoredPositions(
  examId: string,
  serviceId: string,
  defaults: DiagramNode[]
): DiagramNode[] {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(storageKey(examId, serviceId));
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as StoredDiagram;
    if (parsed?.v !== STORAGE_VERSION || !Array.isArray(parsed.nodes)) return defaults;
    return defaults.map((d) => {
      const hit = parsed.nodes.find((n) => n.id === d.id);
      if (!hit) return d;
      return { ...d, x: hit.x, y: hit.y };
    });
  } catch {
    return defaults;
  }
}

type Props = {
  examId: string;
  serviceId: string;
};

export function ServiceDiagramCanvas({ examId, serviceId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const defaults = useRef(buildInitialNodes(serviceId));
  const [nodes, setNodes] = useState<DiagramNode[]>(() => defaults.current);
  const [drag, setDrag] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  useEffect(() => {
    defaults.current = buildInitialNodes(serviceId);
    setNodes(loadStoredPositions(examId, serviceId, defaults.current));
  }, [examId, serviceId]);

  const persist = useCallback(
    (next: DiagramNode[]) => {
      if (typeof window === "undefined") return;
      const payload: StoredDiagram = {
        v: STORAGE_VERSION,
        nodes: next.map(({ id, x, y }) => ({ id, x, y })),
      };
      window.localStorage.setItem(storageKey(examId, serviceId), JSON.stringify(payload));
    },
    [examId, serviceId]
  );

  const clamp = useCallback((x: number, y: number, w: number, h: number, rect: DOMRect) => {
    const pad = 8;
    const maxX = Math.max(pad, rect.width - w - pad);
    const maxY = Math.max(pad, rect.height - h - pad);
    return {
      x: Math.min(maxX, Math.max(pad, x)),
      y: Math.min(maxY, Math.max(pad, y)),
    };
  }, []);

  useEffect(() => {
    if (!drag) return;

    const onMove = (ev: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const w = 112;
      const h = 44;
      const rawX = ev.clientX - rect.left - drag.offsetX;
      const rawY = ev.clientY - rect.top - drag.offsetY;
      const { x, y } = clamp(rawX, rawY, w, h, rect);
      setNodes((prev) => prev.map((n) => (n.id === drag.id ? { ...n, x, y } : n)));
    };

    const onUp = () => {
      setDrag(null);
      setNodes((prev) => {
        persist(prev);
        return prev;
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [drag, clamp, persist]);

  const onPointerDown = (ev: React.PointerEvent, node: DiagramNode) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    ev.currentTarget.setPointerCapture(ev.pointerId);
    setDrag({
      id: node.id,
      offsetX: ev.clientX - rect.left - node.x,
      offsetY: ev.clientY - rect.top - node.y,
    });
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 sm:p-5">
      <h2 className="font-sans text-lg font-semibold text-white">Architecture canvas</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Drag chips freely to sketch how pieces fit. Layout is saved in this browser only (
        <span className="font-mono text-xs text-zinc-500">localStorage</span>).
      </p>
      <div
        ref={containerRef}
        className="relative mt-4 min-h-[300px] overflow-hidden rounded-xl border border-dashed border-white/15 bg-zinc-950/80 bg-[linear-gradient(to_right,rgb(39_39_42/0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgb(39_39_42/0.35)_1px,transparent_1px)] bg-[size:24px_24px]"
      >
        {nodes.map((n) => (
          <button
            key={n.id}
            type="button"
            className="absolute flex h-11 w-28 cursor-grab select-none items-center justify-center rounded-lg border border-orange-500/30 bg-zinc-900/95 px-2 text-center text-[11px] font-medium leading-tight text-orange-100 shadow-md shadow-black/30 active:cursor-grabbing"
            style={{ left: n.x, top: n.y }}
            onPointerDown={(e) => onPointerDown(e, n)}
          >
            {n.label}
          </button>
        ))}
      </div>
    </section>
  );
}
