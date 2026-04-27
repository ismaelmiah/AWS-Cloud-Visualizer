"use client";

import {
  addEdge,
  Background,
  Controls,
  type EdgeChange,
  type Node,
  type NodeChange,
  type OnConnect,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { AwsServiceNode } from "./aws-service-node";
import type { ArchitectureFlowDocumentV1, ArchNodeDataV1 } from "@/lib/architecture-flow-document";
import { documentToFlowElements, flowElementsToDocument } from "@/lib/architecture-flow-adapter";
import { getPaletteEntry } from "@/lib/architecture-palette";

const nodeTypes = { awsService: AwsServiceNode };

export type ArchitectureCanvasRef = {
  getDocument: () => ArchitectureFlowDocumentV1;
  getExportElement: () => HTMLElement | null;
  setDocument: (doc: ArchitectureFlowDocumentV1) => void;
  addPaletteNode: (paletteId: string) => void;
  fitView: () => void;
};

type InnerProps = {
  initialDocument: ArchitectureFlowDocumentV1;
  readOnly?: boolean;
  serviceScale?: number;
  canvasHeightPx?: number;
  canvasWidthPx?: number;
  /**
   * Fired on meaningful edits; parent should not feed this back as `initialDocument` each time
   * (use a remount `key` when loading a new document).
   */
  onChange?: (doc: ArchitectureFlowDocumentV1) => void;
  className?: string;
};

const ArchitectureCanvasInner = forwardRef<ArchitectureCanvasRef, InnerProps>(function ArchitectureCanvasInner(
  {
    initialDocument,
    readOnly = false,
    serviceScale = 1,
    canvasHeightPx = 620,
    canvasWidthPx,
    onChange,
    className = "",
  },
  ref
) {
  const { nodes: baseNodes, edges: initEdges } = documentToFlowElements(initialDocument);
  const initNodes = baseNodes;
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const wrapRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const { getViewport, setViewport, fitView, screenToFlowPosition, getNodes, getEdges } = useReactFlow();

  const maybeEmit = useCallback(() => {
    const o = onChangeRef.current;
    if (!o || readOnly) return;
    const n = getNodes();
    const e = getEdges();
    const v = getViewport();
    o(flowElementsToDocument(n, e, v));
  }, [readOnly, getNodes, getEdges, getViewport]);

  const removeNodeById = useCallback(
    (id: string) => {
      if (readOnly) return;
      setNodes((prev) => prev.filter((node) => node.id !== id));
      setEdges((prev) => prev.filter((edge) => edge.source !== id && edge.target !== id));
      requestAnimationFrame(() => {
        requestAnimationFrame(maybeEmit);
      });
    },
    [readOnly, setNodes, setEdges, maybeEmit]
  );

  const decorateNode = useCallback(
    (n: Node): Node => ({
      ...n,
      data: {
        ...(n.data as Record<string, unknown>),
        scale: serviceScale,
        ...(readOnly ? {} : { onRemove: removeNodeById }),
      },
    }),
    [readOnly, serviceScale, removeNodeById]
  );

  const onNodesChangeWrapped = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      requestAnimationFrame(() => {
        requestAnimationFrame(maybeEmit);
      });
    },
    [onNodesChange, maybeEmit]
  );

  const onEdgesChangeWrapped = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      requestAnimationFrame(() => {
        requestAnimationFrame(maybeEmit);
      });
    },
    [onEdgesChange, maybeEmit]
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      if (readOnly) return;
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            id: `e-${params.source}-${params.target}-${nanoid(6)}`,
            type: "smoothstep",
          },
          eds
        )
      );
      requestAnimationFrame(() => {
        requestAnimationFrame(maybeEmit);
      });
    },
    [readOnly, setEdges, maybeEmit]
  );

  const onNodeDragStop = useCallback(() => {
    if (!readOnly) maybeEmit();
  }, [readOnly, maybeEmit]);

  const onMoveEnd = useCallback(() => {
    if (!readOnly) maybeEmit();
  }, [readOnly, maybeEmit]);

  useImperativeHandle(
    ref,
    () => ({
      getDocument: () => {
        const v = getViewport();
        return flowElementsToDocument(getNodes(), getEdges(), v);
      },
      getExportElement: () => wrapRef.current,
      setDocument: (doc: ArchitectureFlowDocumentV1) => {
        const { nodes: n, edges: e } = documentToFlowElements(doc);
        setNodes(n.map(decorateNode));
        setEdges(e);
        const v = doc.viewport;
        void setViewport({ x: v.x, y: v.y, zoom: v.zoom }, { duration: 0 });
      },
      addPaletteNode: (paletteId: string) => {
        if (readOnly) return;
        const entry = getPaletteEntry(paletteId);
        const label = entry?.label ?? paletteId;
        const p = screenToFlowPosition({ x: window.innerWidth / 2, y: 300 });
        const n: Node<ArchNodeDataV1, "awsService"> = {
          id: `n-${nanoid(8)}`,
          type: "awsService",
          position: { x: p.x - 64, y: p.y - 24 },
          data: { paletteId, label },
        };
        setNodes((prev) => [...prev, decorateNode(n)]);
        requestAnimationFrame(() => {
          requestAnimationFrame(maybeEmit);
        });
      },
      fitView: () => {
        void fitView({ padding: 0.2, duration: 200 });
        requestAnimationFrame(() => {
          requestAnimationFrame(maybeEmit);
        });
      },
    }),
    [getNodes, getEdges, getViewport, setNodes, setEdges, setViewport, readOnly, fitView, screenToFlowPosition, maybeEmit, decorateNode, serviceScale]
  );

  // Optional: re-sync when `initialDocument` is replaced and parent remounts without new key
  const mountDoc = useRef<string>(JSON.stringify(initialDocument));
  useEffect(() => {
    const s = JSON.stringify(initialDocument);
    if (s === mountDoc.current) return;
    mountDoc.current = s;
    const { nodes: n, edges: e } = documentToFlowElements(initialDocument);
    setNodes(n.map(decorateNode));
    setEdges(e);
    const v = initialDocument.viewport;
    void setViewport({ x: v.x, y: v.y, zoom: v.zoom }, { duration: 0 });
  }, [initialDocument, setNodes, setEdges, setViewport, decorateNode]);

  useEffect(() => {
    setNodes((prev) => prev.map((n) => decorateNode(n)));
  }, [serviceScale, readOnly, decorateNode, setNodes]);

  return (
    <div
      ref={wrapRef}
      className={`min-h-[420px] rounded-xl border border-zinc-700/80 bg-zinc-900/50 ${className}`}
      style={{ height: canvasHeightPx, width: canvasWidthPx ?? "100%", maxWidth: "100%" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChangeWrapped}
        onEdgesChange={readOnly ? undefined : onEdgesChangeWrapped}
        onConnect={onConnect}
        onNodeDragStop={readOnly ? undefined : onNodeDragStop}
        onMoveEnd={onMoveEnd}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-zinc-950/80"
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        selectNodesOnDrag={!readOnly}
        deleteKeyCode={readOnly ? null : ["Backspace", "Delete"]}
      >
        <Background color="#52525b" gap={20} size={1} />
        <Controls className="!m-2 !border-zinc-600 !bg-zinc-900/90 [&_button]:!border-zinc-600 [&_button]:!bg-zinc-800 [&_button:hover]:!bg-zinc-700" />
        <MiniMap
          className="!m-2 !border-zinc-600 !bg-zinc-900/80"
          nodeStrokeWidth={2}
          maskColor="rgba(24, 24, 27, 0.7)"
        />
      </ReactFlow>
    </div>
  );
});

type ShellProps = InnerProps & { innerRef: React.ForwardedRef<ArchitectureCanvasRef> };

function WithProvider({ innerRef, ...props }: ShellProps) {
  return (
    <ReactFlowProvider>
      <ArchitectureCanvasInner ref={innerRef} {...props} />
    </ReactFlowProvider>
  );
}

export const ArchitectureCanvas = forwardRef<ArchitectureCanvasRef, InnerProps>(function ArchitectureCanvas(
  props,
  ref
) {
  return <WithProvider {...props} innerRef={ref} />;
});

export type { ArchitectureFlowDocumentV1 } from "@/lib/architecture-flow-document";
