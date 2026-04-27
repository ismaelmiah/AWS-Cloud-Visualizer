"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import { getPaletteEntry } from "@/lib/architecture-palette";
import type { ArchNodeDataV1 } from "@/lib/architecture-flow-document";

type AwsServiceUiData = ArchNodeDataV1 & {
  scale?: number;
  onRemove?: (id: string) => void;
};

function AwsServiceNodeComponent(props: NodeProps<Node<AwsServiceUiData, "awsService">>) {
  const { data } = props;
  const entry = getPaletteEntry(data.paletteId);
  const label = data.label;
  const iconFile = entry?.iconFile ?? "ec2.svg";

  const scale = Math.min(1.8, Math.max(0.75, data.scale ?? 1));
  const iconBox = Math.round(36 * scale);
  const icon = Math.round(28 * scale);
  const fontSize = `${Math.max(11, Math.round(14 * scale))}px`;

  return (
    <div className="relative rounded-lg border border-zinc-600/80 bg-zinc-900/95 px-2 py-1.5 shadow-md shadow-black/30">
      {data.onRemove ? (
        <button
          type="button"
          onClick={() => data.onRemove?.(props.id)}
          className="absolute -right-2 -top-2 z-20 h-5 w-5 rounded-full border border-zinc-600 bg-zinc-900 text-xs text-zinc-300 hover:border-rose-400 hover:text-rose-300"
          aria-label={`Remove ${label}`}
          title="Remove service"
        >
          ×
        </button>
      ) : null}
      <Handle type="target" position={Position.Top} className="!h-2 !w-2 !bg-zinc-500" />
      <div className="flex items-center gap-2">
        <div
          className="flex flex-shrink-0 items-center justify-center rounded bg-white/95 p-1"
          style={{ width: iconBox, height: iconBox }}
        >
          <img
            src={`/aws-icons/${iconFile}`}
            alt=""
            className="object-contain"
            width={icon}
            height={icon}
            style={{ width: icon, height: icon }}
          />
        </div>
        <span
          className="max-w-[12rem] truncate text-left font-medium text-zinc-100"
          title={label}
          style={{ fontSize }}
        >
          {label}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2 !bg-zinc-500" />
    </div>
  );
}

export const AwsServiceNode = memo(AwsServiceNodeComponent);
