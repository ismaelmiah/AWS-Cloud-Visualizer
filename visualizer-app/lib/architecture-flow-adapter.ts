import type { Edge, Node } from "@xyflow/react";
import type { ArchitectureFlowDocumentV1, ArchNodeDataV1, ArchFlowEdgeV1, ArchFlowNodeV1 } from "./architecture-flow-document";
import { ARCH_FLOW_VERSION, emptyFlowDocument } from "./architecture-flow-document";

function isArchNodeData(v: unknown): v is ArchNodeDataV1 {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  const o = v as Record<string, unknown>;
  return typeof o.paletteId === "string" && typeof o.label === "string";
}

export function documentToFlowElements(doc: ArchitectureFlowDocumentV1): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = doc.nodes.map(
    (n) =>
      ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
      }) as Node
  );
  const edges: Edge[] = doc.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? undefined,
    targetHandle: e.targetHandle ?? undefined,
    type: "smoothstep" as const,
  }));
  return { nodes, edges };
}

export function flowElementsToDocument(
  nodes: Node[],
  edges: Edge[],
  viewport: { x: number; y: number; zoom: number }
): ArchitectureFlowDocumentV1 {
  const archNodes: ArchFlowNodeV1[] = [];
  for (const n of nodes) {
    if (n.type !== "awsService" || !isArchNodeData(n.data)) continue;
    archNodes.push({
      id: n.id,
      type: "awsService",
      position: { x: n.position.x, y: n.position.y },
      data: { paletteId: n.data.paletteId, label: n.data.label },
    });
  }
  const idSet = new Set(archNodes.map((a) => a.id));
  const archEdges: ArchFlowEdgeV1[] = [];
  for (const e of edges) {
    if (!idSet.has(e.source) || !idSet.has(e.target)) continue;
    archEdges.push({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: (e as Edge & { sourceHandle?: string | null }).sourceHandle ?? null,
      targetHandle: (e as Edge & { targetHandle?: string | null }).targetHandle ?? null,
    });
  }
  return {
    v: ARCH_FLOW_VERSION,
    nodes: archNodes,
    edges: archEdges,
    viewport: { x: viewport.x, y: viewport.y, zoom: viewport.zoom },
  };
}

export function ensureDocument(
  d: ArchitectureFlowDocumentV1 | null | undefined
): ArchitectureFlowDocumentV1 {
  if (!d || d.v !== ARCH_FLOW_VERSION) return emptyFlowDocument();
  return d;
}
