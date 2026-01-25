"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { ConceptDiagram, ConceptLegend, ConceptLegendTone, ServiceConceptSpec } from "@/lib/saa-service-concepts";
import { ConceptCanvasViewport } from "./concept-canvas-viewport";

const NODE_W = 210;
const NODE_H = 64;
const VB = { w: 900, h: 380 };
const LEFT_X = 36;
const MID_X = 350;
const RIGHT_X = 640;

const NODE_STORE_VERSION = 1;

function nodeStorageKey(examId: string, serviceId: string) {
  return `viz:concept-nodes:${NODE_STORE_VERSION}:${examId}:${serviceId}`;
}

type NodeOffsets = Record<string, { x: number; y: number }>;

function buildBaseLayout(diagram: ConceptDiagram): NodeOffsets {
  const centerY = VB.h / 2 - NODE_H / 2;
  const stackYs = (count: number) => {
    if (count <= 0) return [];
    const gap = 18;
    const total = count * NODE_H + (count - 1) * gap;
    const y0 = VB.h / 2 - total / 2;
    return Array.from({ length: count }, (_, i) => y0 + i * (NODE_H + gap));
  };
  const leftYs = stackYs(diagram.left.length);
  const rightYs = stackYs(diagram.right.length);
  const map: NodeOffsets = {};
  diagram.left.forEach((n, i) => {
    map[n.id] = { x: LEFT_X, y: leftYs[i] ?? 60 };
  });
  map[diagram.center.id] = { x: MID_X, y: centerY };
  diagram.right.forEach((n, i) => {
    map[n.id] = { x: RIGHT_X, y: rightYs[i] ?? 60 };
  });
  return map;
}

function loadOffsets(examId: string, serviceId: string, base: NodeOffsets): NodeOffsets {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(nodeStorageKey(examId, serviceId));
    if (!raw) return {};
    const p = JSON.parse(raw) as { v?: number; nodes?: NodeOffsets };
    if (p?.v !== NODE_STORE_VERSION || !p.nodes || typeof p.nodes !== "object") return {};
    const out: NodeOffsets = {};
    for (const id of Object.keys(base)) {
      const hit = p.nodes[id];
      if (hit && typeof hit.x === "number" && typeof hit.y === "number") out[id] = { x: hit.x, y: hit.y };
    }
    return out;
  } catch {
    return {};
  }
}

function saveOffsets(examId: string, serviceId: string, offsets: NodeOffsets) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    nodeStorageKey(examId, serviceId),
    JSON.stringify({ v: NODE_STORE_VERSION, nodes: offsets })
  );
}

const toneChip: Record<ConceptLegendTone, string> = {
  sky: "border-sky-500/25 bg-sky-500/10",
  orange: "border-orange-500/25 bg-orange-500/10",
  amber: "border-amber-500/25 bg-amber-500/10",
  emerald: "border-emerald-500/25 bg-emerald-500/10",
  violet: "border-violet-500/25 bg-violet-500/10",
};

const toneTitle: Record<ConceptLegendTone, string> = {
  sky: "text-sky-200",
  orange: "text-orange-200",
  amber: "text-amber-200",
  emerald: "text-emerald-200",
  violet: "text-violet-200",
};

function Marker({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" className="fill-zinc-500" />
      </marker>
    </defs>
  );
}

function posFor(
  id: string,
  base: NodeOffsets,
  extra: NodeOffsets
): { x: number; y: number } {
  const b = base[id];
  if (!b) return { x: 0, y: 0 };
  const e = extra[id] ?? { x: 0, y: 0 };
  return { x: b.x + e.x, y: b.y + e.y };
}

function ConceptInteractiveSvg({
  diagram,
  examId,
  serviceId,
}: {
  diagram: ConceptDiagram;
  examId: string;
  serviceId: string;
}) {
  const markerId = `mk-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const base = useMemo(() => buildBaseLayout(diagram), [diagram]);
  const [extra, setExtra] = useState<NodeOffsets>({});

  useEffect(() => {
    setExtra(loadOffsets(examId, serviceId, base));
  }, [examId, serviceId, base]);

  const onNodeDown = (ev: React.PointerEvent, id: string) => {
    ev.stopPropagation();
    ev.preventDefault();
    const startX = ev.clientX;
    const startY = ev.clientY;
    const orig = extra[id] ?? { x: 0, y: 0 };
    const el = ev.currentTarget as SVGGElement;
    el.setPointerCapture(ev.pointerId);

    const onMove = (e: PointerEvent) => {
      setExtra((prev) => ({
        ...prev,
        [id]: {
          x: orig.x + (e.clientX - startX),
          y: orig.y + (e.clientY - startY),
        },
      }));
    };
    const onUp = (e: PointerEvent) => {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setExtra((prev) => {
        const next = {
          ...prev,
          [id]: {
            x: orig.x + (e.clientX - startX),
            y: orig.y + (e.clientY - startY),
          },
        };
        saveOffsets(examId, serviceId, next);
        return next;
      });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const edgeOutToIn = (fromId: string, toId: string, dashed = false) => {
    const a = posFor(fromId, base, extra);
    const b = posFor(toId, base, extra);
    const x1 = a.x + NODE_W;
    const y1 = a.y + NODE_H / 2;
    const x2 = b.x;
    const y2 = b.y + NODE_H / 2;
    const mx = (x1 + x2) / 2;
    const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
    return (
      <path
        key={`${fromId}-${toId}-${dashed}`}
        d={d}
        fill="none"
        className="stroke-zinc-600 stroke-[1.5]"
        markerEnd={`url(#${markerId})`}
        style={dashed ? { strokeDasharray: "4 3" } : undefined}
      />
    );
  };

  const nodeRect = (
    id: string,
    label: string,
    sub: string | undefined,
    accent: "zinc" | "orange" | "emerald"
  ) => {
    const p = posFor(id, base, extra);
    const stroke =
      accent === "orange"
        ? "stroke-orange-400/60"
        : accent === "emerald"
          ? "stroke-emerald-400/55"
          : "stroke-zinc-500/50";
    return (
      <g
        key={id}
        transform={`translate(${p.x},${p.y})`}
        className="cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={(e) => onNodeDown(e, id)}
        style={{ pointerEvents: "all" }}
      >
        <rect
          x={0}
          y={0}
          width={NODE_W}
          height={NODE_H}
          rx={12}
          className={`fill-zinc-900 ${stroke} stroke-2`}
        />
        <text x={NODE_W / 2} y={28} textAnchor="middle" className="text-sm font-semibold fill-zinc-100 pointer-events-none">
          {label}
        </text>
        {sub ? (
          <text x={NODE_W / 2} y={48} textAnchor="middle" className="text-[10px] fill-zinc-500 pointer-events-none">
            {sub}
          </text>
        ) : null}
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      width={VB.w}
      height={VB.h}
      className="max-h-[min(68vh,560px)] w-auto select-none"
      role="img"
      aria-label={diagram.ariaLabel}
    >
      <title>{diagram.ariaLabel}</title>
      <Marker id={markerId} />

      <text x={LEFT_X + NODE_W / 2} y={28} textAnchor="middle" className="text-xs font-semibold fill-zinc-500 pointer-events-none">
        Inputs
      </text>
      <text x={MID_X + NODE_W / 2} y={28} textAnchor="middle" className="text-xs font-semibold fill-zinc-500 pointer-events-none">
        Core
      </text>
      <text x={RIGHT_X + NODE_W / 2} y={28} textAnchor="middle" className="text-xs font-semibold fill-zinc-500 pointer-events-none">
        Outcomes
      </text>

      <g className="pointer-events-none">
        {diagram.left.map((n) => edgeOutToIn(n.id, diagram.center.id, false))}
        {diagram.right.map((n) => edgeOutToIn(diagram.center.id, n.id, true))}
      </g>

      {diagram.left.map((n) => nodeRect(n.id, n.label, n.sub, "zinc"))}
      {nodeRect(diagram.center.id, diagram.center.label, diagram.center.sub, "orange")}
      {diagram.right.map((n) => nodeRect(n.id, n.label, n.sub, "emerald"))}
    </svg>
  );
}

function LegendTile({
  legend,
  onPractice,
}: {
  legend: ConceptLegend;
  onPractice: () => void;
}) {
  return (
    <div className={`flex h-full flex-col rounded-lg border px-2.5 py-2.5 text-left ${toneChip[legend.tone]}`}>
      <div className="flex items-start justify-between gap-1">
        <p className={`min-w-0 text-[11px] font-semibold uppercase tracking-wide ${toneTitle[legend.tone]}`}>
          {legend.title}
        </p>
        <button
          type="button"
          onClick={onPractice}
          title="Quiz — this angle"
          aria-label={`Open quiz: ${legend.title}`}
          className="shrink-0 rounded-full border border-white/15 bg-zinc-950/70 px-2 py-0.5 text-xs font-bold text-orange-100 transition hover:border-orange-500/50"
        >
          ?
        </button>
      </div>
      <p className="mt-1 flex-1 text-[11px] leading-snug text-zinc-500">{legend.body}</p>
    </div>
  );
}

export type ServiceConceptGraphProps = {
  spec: ServiceConceptSpec;
  onPracticeAngle: (title: string, subtitle: string) => void;
  examId: string;
  serviceId: string;
};

export function ServiceConceptGraph({ spec, onPracticeAngle, examId, serviceId }: ServiceConceptGraphProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 pr-20 pt-3 sm:p-5 sm:pr-28">
      <h2 className="font-sans text-lg font-semibold text-white">{spec.headline}</h2>
      <p className="mt-1 max-w-3xl text-sm text-zinc-400">{spec.intro}</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {spec.legends.map((legend) => (
          <LegendTile
            key={legend.title}
            legend={legend}
            onPractice={() => onPracticeAngle(legend.title, legend.quizBlurb)}
          />
        ))}
      </div>

      <div className="mt-4">
        <ConceptCanvasViewport examId={examId} serviceId={serviceId}>
          <ConceptInteractiveSvg diagram={spec.diagram} examId={examId} serviceId={serviceId} />
        </ConceptCanvasViewport>
      </div>

      {spec.footnote ? <p className="mt-3 text-[11px] text-zinc-600">{spec.footnote}</p> : null}
    </section>
  );
}
