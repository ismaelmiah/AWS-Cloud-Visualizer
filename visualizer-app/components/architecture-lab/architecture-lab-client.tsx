"use client";

import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArchitectureCanvas, type ArchitectureCanvasRef } from "./architecture-canvas";
import type { ArchitectureDesignWithFlow } from "@/lib/architecture-metadata";
import { encodeFlowForShareUrl } from "@/lib/architecture-share-codec";
import {
  clearDraftFromBrowser,
  loadDraftFromBrowser,
  removeDesignFromBrowser,
  saveDraftToBrowser,
} from "@/lib/architecture-local-storage";
import type { ArchitectureFlowDocumentV1 } from "@/lib/architecture-flow-document";
import { emptyFlowDocument } from "@/lib/architecture-flow-document";
import { exportArchitecturePdf, exportArchitecturePng, downloadBlob } from "@/lib/architecture-export";
import { ARCHITECTURE_PALETTE } from "@/lib/architecture-palette";

const SHARE_PATH = "/share/architect";
const WARN_URL_CHARS = 6000;

async function fetchDesigns(): Promise<ArchitectureDesignWithFlow[]> {
  const r = await fetch("/api/architecture-saves", { method: "GET" });
  if (r.status === 503) {
    throw new Error("Design storage is not configured on the server.");
  }
  if (!r.ok) throw new Error("Failed to load saves");
  const j = (await r.json()) as { designs: ArchitectureDesignWithFlow[] };
  return j.designs ?? [];
}

export function ArchitectureLabClient() {
  const [designs, setDesigns] = useState<ArchitectureDesignWithFlow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState("My architecture");
  const [message, setMessage] = useState<string | null>(null);
  const [canvasKey, setCanvasKey] = useState(0);
  const [serviceScale, setServiceScale] = useState(1);
  const [canvasHeightPx, setCanvasHeightPx] = useState(620);
  const [canvasWidthPx, setCanvasWidthPx] = useState<number | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const resizingRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);
  const [flowDoc, setFlowDoc] = useState<ArchitectureFlowDocumentV1>(() => {
    if (typeof window === "undefined") return emptyFlowDocument();
    return loadDraftFromBrowser() ?? emptyFlowDocument();
  });
  const canvasRef = useRef<ArchitectureCanvasRef | null>(null);
  const draftAfterMount = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await fetchDesigns();
        if (!cancelled) setDesigns(d);
      } catch {
        if (!cancelled) setLoadError("Could not load your saved list.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist unauthenticated / draft to browser while editing (no id yet)
  useEffect(() => {
    if (currentId) return;
    if (!draftAfterMount.current) {
      draftAfterMount.current = true;
      return;
    }
    saveDraftToBrowser(flowDoc);
  }, [flowDoc, currentId]);

  const onFlowChange = useCallback((d: ArchitectureFlowDocumentV1) => {
    setFlowDoc(d);
  }, []);

  const newDiagram = useCallback(() => {
    setCurrentId(null);
    setTitle("My architecture");
    setFlowDoc(emptyFlowDocument());
    setCanvasKey((k) => k + 1);
    clearDraftFromBrowser();
    setMessage("New canvas — add services from the palette.");
  }, []);

  const buildSharePath = (doc: ArchitectureFlowDocumentV1) => {
    const z = encodeFlowForShareUrl(doc);
    return `${SHARE_PATH}?z=${encodeURIComponent(z)}`;
  };

  const copyShareLink = useCallback(async () => {
    const toShare = canvasRef.current?.getDocument() ?? flowDoc;
    const path = buildSharePath(toShare);
    if (path.length > WARN_URL_CHARS) {
      setMessage("This design is very large; the link may be too long for some browsers. Use PNG or PDF instead.");
    } else {
      setMessage(null);
    }
    const full =
      typeof window === "undefined" ? path : `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(full);
      setMessage("Share link copied to the clipboard.");
    } catch {
      setMessage("Could not copy — copy the URL from the address bar after opening preview.");
    }
  }, [flowDoc]);

  const saveToServer = useCallback(
    async (id: string, t: string, doc: ArchitectureFlowDocumentV1) => {
      const r = await fetch("/api/architecture-saves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: t, flow: doc }),
      });
      if (!r.ok) {
        const e = (await r.json().catch(() => ({}))) as { error?: string };
        throw new Error(e.error ?? "Save failed");
      }
      const j = (await r.json()) as { designs: ArchitectureDesignWithFlow[] };
      setDesigns(j.designs);
    },
    []
  );

  const save = useCallback(async () => {
    setMessage(null);
    const doc = canvasRef.current?.getDocument() ?? flowDoc;
    const t = title.trim() || "Untitled";
    const wasNew = !currentId;
    let id = currentId;
    if (!id) {
      id = nanoid(12);
      setCurrentId(id);
    }
    try {
      await saveToServer(id, t, doc);
      setFlowDoc(doc);
      if (wasNew) {
        clearDraftFromBrowser();
      }
      setMessage(
        "Saved to your account. Use “Copy link” for a shareable URL, or open this design on another device after signing in."
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed");
    }
  }, [title, currentId, flowDoc, saveToServer]);

  const selectDesign = useCallback(
    (row: ArchitectureDesignWithFlow) => {
      setMessage(null);
      setCurrentId(row.id);
      setTitle(row.title);
      setFlowDoc(row.flow);
      setCanvasKey((k) => k + 1);
      void fetch("/api/architecture-saves", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, touchOpened: true }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => {
          if (j && Array.isArray((j as { designs: ArchitectureDesignWithFlow[] }).designs)) {
            setDesigns((j as { designs: ArchitectureDesignWithFlow[] }).designs);
          }
        });
    },
    []
  );

  const deleteDesign = useCallback(async (id: string) => {
    setMessage(null);
    const r = await fetch("/api/architecture-saves", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!r.ok) {
      setMessage("Delete failed");
      return;
    }
    const j = (await r.json()) as { designs: ArchitectureDesignWithFlow[] };
    setDesigns(j.designs);
    removeDesignFromBrowser(id);
    if (currentId === id) {
      newDiagram();
    }
  }, [currentId, newDiagram]);

  const exportPng = useCallback(async () => {
    setMessage(null);
    const el = canvasRef.current?.getExportElement();
    if (!el) {
      setMessage("Canvas not ready.");
      return;
    }
    try {
      const blob = await exportArchitecturePng(el);
      downloadBlob(blob, "aws-architecture.png");
      setMessage("Downloaded PNG.");
    } catch {
      setMessage("PNG export failed.");
    }
  }, []);

  const exportPdf = useCallback(async () => {
    setMessage(null);
    const el = canvasRef.current?.getExportElement();
    if (!el) {
      setMessage("Canvas not ready.");
      return;
    }
    try {
      const blob = await exportArchitecturePdf(el);
      downloadBlob(blob, "aws-architecture.pdf");
      setMessage("Downloaded PDF.");
    } catch {
      setMessage("PDF export failed.");
    }
  }, []);

  const toggleMaximize = useCallback(() => {
    setIsMaximized((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        const h = Math.max(520, Math.min(1100, Math.round(window.innerHeight * (next ? 0.86 : 0.7))));
        setCanvasHeightPx(h);
        setCanvasWidthPx(next ? null : canvasWidthPx);
      }
      return next;
    });
  }, [canvasWidthPx]);

  const startCanvasResize = useCallback(
    (ev: ReactPointerEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
      const host = ev.currentTarget.parentElement;
      const rect = host?.getBoundingClientRect();
      resizingRef.current = {
        startX: ev.clientX,
        startY: ev.clientY,
        startWidth: Math.round(rect?.width ?? (canvasWidthPx ?? 900)),
        startHeight: canvasHeightPx,
      };
    },
    [canvasHeightPx, canvasWidthPx]
  );

  const onCanvasResizeMove = useCallback((ev: ReactPointerEvent<HTMLButtonElement>) => {
    const state = resizingRef.current;
    if (!state) return;
    const deltaX = ev.clientX - state.startX;
    const delta = ev.clientY - state.startY;
    const maxW = typeof window !== "undefined" ? Math.max(640, window.innerWidth - 120) : 1400;
    const nextW = Math.max(520, Math.min(maxW, Math.round(state.startWidth + deltaX)));
    const next = Math.max(420, Math.min(1200, Math.round(state.startHeight + delta)));
    setCanvasWidthPx(nextW);
    setCanvasHeightPx(next);
    setIsMaximized(false);
  }, []);

  const stopCanvasResize = useCallback((ev: ReactPointerEvent<HTMLButtonElement>) => {
    if (ev.currentTarget.hasPointerCapture(ev.pointerId)) {
      ev.currentTarget.releasePointerCapture(ev.pointerId);
    }
    resizingRef.current = null;
  }, []);

  return (
    <div>
      <div className="max-w-3xl">
        <h1 className="font-sans text-2xl font-semibold tracking-tight text-white sm:text-3xl">Architecture lab</h1>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">
          Drag AWS service blocks, connect them to show data and request flows, then export or share. When you
          save, the diagram is stored in your Supabase project (per signed-in user). A shareable link can still
          carry a compressed copy for people without an account.
        </p>
      </div>

      {loadError ? <p className="mt-4 text-sm text-amber-400/90">{loadError}</p> : null}
      {message ? <p className="mt-3 text-sm text-zinc-300">{message}</p> : null}

      <div className="mt-6 flex flex-col gap-4 lg:flex-row">
        <aside className="w-full flex-shrink-0 space-y-3 lg:max-w-[200px]">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Add services</h2>
          <ul className="space-y-1.5">
            {ARCHITECTURE_PALETTE.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => canvasRef.current?.addPaletteNode(e.id)}
                  className="flex w-full items-center gap-2 rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-2 py-1.5 text-left text-sm text-zinc-200 transition hover:border-orange-500/40 hover:bg-zinc-800/80"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded bg-white/90 p-0.5">
                    <img src={`/aws-icons/${e.iconFile}`} alt="" className="h-6 w-6" width={24} height={24} />
                  </span>
                  <span className="truncate">{e.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="min-w-0 sm:flex-1">
              <label className="block text-xs font-medium text-zinc-500">Name (for your saved list)</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full min-w-0 rounded-lg border border-zinc-600 bg-zinc-900/80 px-3 py-2 text-sm text-white placeholder:text-zinc-600"
                maxLength={100}
                placeholder="e.g. Three-tier with CloudFront"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={save}
                className="rounded-lg border border-orange-500/50 bg-orange-500/20 px-3 py-2 text-sm font-medium text-orange-200 transition hover:bg-orange-500/30"
              >
                Save
              </button>
              <button
                type="button"
                onClick={newDiagram}
                className="rounded-lg border border-zinc-600 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200"
              >
                New
              </button>
              <button
                type="button"
                onClick={copyShareLink}
                className="rounded-lg border border-zinc-600 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200"
              >
                Copy link
              </button>
              <button
                type="button"
                onClick={exportPng}
                className="rounded-lg border border-zinc-600 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200"
              >
                PNG
              </button>
              <button
                type="button"
                onClick={exportPdf}
                className="rounded-lg border border-zinc-600 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200"
              >
                PDF
              </button>
              <button
                type="button"
                onClick={() => canvasRef.current?.fitView()}
                className="rounded-lg border border-zinc-600 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200"
              >
                Fit
              </button>
              <button
                type="button"
                onClick={toggleMaximize}
                className="rounded-lg border border-zinc-600 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200"
              >
                {isMaximized ? "Normal size" : "Maximize"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-zinc-700/70 bg-zinc-900/40 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-3 text-sm text-zinc-300">
              <span className="w-24 text-zinc-500">Service size</span>
              <input
                type="range"
                min={75}
                max={180}
                step={5}
                value={Math.round(serviceScale * 100)}
                onChange={(e) => setServiceScale(Number(e.target.value) / 100)}
                className="w-44 accent-orange-500"
              />
              <span className="w-10 text-right tabular-nums text-zinc-400">{Math.round(serviceScale * 100)}%</span>
            </label>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <span className="w-24 text-zinc-500">Canvas size</span>
              <span className="w-14 text-right tabular-nums text-zinc-400">{canvasHeightPx}px</span>
              <span className="text-xs text-zinc-500">Drag bottom-right corner to resize</span>
            </div>
          </div>

          <div className="relative">
            <ArchitectureCanvas
              key={canvasKey}
              ref={canvasRef}
              initialDocument={flowDoc}
              onChange={onFlowChange}
              serviceScale={serviceScale}
              canvasHeightPx={canvasHeightPx}
              canvasWidthPx={canvasWidthPx ?? undefined}
              className={isMaximized ? "ring-2 ring-orange-500/35" : ""}
            />
            <button
              type="button"
              onPointerDown={startCanvasResize}
              onPointerMove={onCanvasResizeMove}
              onPointerUp={stopCanvasResize}
              onPointerCancel={stopCanvasResize}
              className="absolute bottom-2 right-2 z-20 h-4 w-4 cursor-nwse-resize rounded-sm border border-zinc-500/70 bg-zinc-800/90"
              title="Drag to resize canvas"
              aria-label="Resize canvas"
            />
          </div>
        </div>

        <aside className="w-full flex-shrink-0 lg:max-w-[220px]">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">My designs (Supabase)</h2>
          {designs.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">No saved designs yet. Set a name and click Save.</p>
          ) : (
            <ul className="mt-2 max-h-64 space-y-1 overflow-y-auto pr-1">
              {designs.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-1 rounded-md border border-zinc-700/60 bg-zinc-900/50 px-2 py-1.5"
                >
                  <button
                    type="button"
                    onClick={() => selectDesign(d)}
                    className="min-w-0 flex-1 truncate text-left text-sm text-zinc-200"
                    title={d.title}
                  >
                    {d.title}
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteDesign(d.id)}
                    className="shrink-0 text-xs text-zinc-500 hover:text-rose-400"
                    title="Remove"
                    aria-label={`Delete ${d.title}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
