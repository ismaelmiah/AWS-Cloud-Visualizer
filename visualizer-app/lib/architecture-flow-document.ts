/** Serializable architecture canvas for the lab and share links (v1). */

export const ARCH_FLOW_VERSION = 1 as const;

export type ArchNodeDataV1 = {
  paletteId: string;
  label: string;
};

export type ArchFlowNodeV1 = {
  id: string;
  type: "awsService";
  position: { x: number; y: number };
  data: ArchNodeDataV1;
};

export type ArchFlowEdgeV1 = {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
};

export type ArchFlowViewport = {
  x: number;
  y: number;
  zoom: number;
};

export type ArchitectureFlowDocumentV1 = {
  v: typeof ARCH_FLOW_VERSION;
  nodes: ArchFlowNodeV1[];
  edges: ArchFlowEdgeV1[];
  viewport: ArchFlowViewport;
};

export const DEFAULT_ARCH_VIEWPORT: ArchFlowViewport = { x: 0, y: 0, zoom: 1 };

export function emptyFlowDocument(): ArchitectureFlowDocumentV1 {
  return {
    v: ARCH_FLOW_VERSION,
    nodes: [],
    edges: [],
    viewport: { ...DEFAULT_ARCH_VIEWPORT },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isArchNodeDataV1(v: unknown): v is ArchNodeDataV1 {
  if (!isRecord(v)) return false;
  return typeof v.paletteId === "string" && typeof v.label === "string";
}

function isPosition(v: unknown): v is { x: number; y: number } {
  if (!isRecord(v)) return false;
  return typeof v.x === "number" && typeof v.y === "number" && Number.isFinite(v.x) && Number.isFinite(v.y);
}

function isArchFlowNodeV1(v: unknown): v is ArchFlowNodeV1 {
  if (!isRecord(v)) return false;
  if (typeof v.id !== "string" || v.type !== "awsService") return false;
  if (!isPosition(v.position)) return false;
  if (!isArchNodeDataV1(v.data)) return false;
  return true;
}

function isArchFlowEdgeV1(v: unknown): v is ArchFlowEdgeV1 {
  if (!isRecord(v)) return false;
  if (typeof v.id !== "string" || typeof v.source !== "string" || typeof v.target !== "string") {
    return false;
  }
  const sh = v.sourceHandle;
  const th = v.targetHandle;
  if (sh !== null && typeof sh !== "string") return false;
  if (th !== null && typeof th !== "string") return false;
  return true;
}

function isViewport(v: unknown): v is ArchFlowViewport {
  if (!isRecord(v)) return false;
  return (
    typeof v.x === "number" &&
    typeof v.y === "number" &&
    typeof v.zoom === "number" &&
    Number.isFinite(v.x) &&
    Number.isFinite(v.y) &&
    Number.isFinite(v.zoom) &&
    v.zoom > 0
  );
}

/** Sanitize and return a v1 document, or the empty default. */
export function parseArchitectureFlowDocument(value: unknown): ArchitectureFlowDocumentV1 {
  if (!isRecord(value) || value.v !== ARCH_FLOW_VERSION) {
    return emptyFlowDocument();
  }
  if (!Array.isArray(value.nodes) || !Array.isArray(value.edges)) {
    return emptyFlowDocument();
  }
  const nodes: ArchFlowNodeV1[] = [];
  const seenN = new Set<string>();
  for (const n of value.nodes) {
    if (nodes.length >= 200) break;
    if (isArchFlowNodeV1(n) && n.id && !seenN.has(n.id)) {
      seenN.add(n.id);
      nodes.push({
        id: n.id,
        type: "awsService",
        position: { x: n.position.x, y: n.position.y },
        data: { paletteId: n.data.paletteId, label: n.data.label },
      });
    }
  }
  const edges: ArchFlowEdgeV1[] = [];
  for (const e of value.edges) {
    if (edges.length >= 400) break;
    if (isArchFlowEdgeV1(e) && seenN.has(e.source) && seenN.has(e.target)) {
      edges.push({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
      });
    }
  }
  const viewport = isViewport(value.viewport) ? value.viewport : { ...DEFAULT_ARCH_VIEWPORT };
  return { v: ARCH_FLOW_VERSION, nodes, edges, viewport };
}
