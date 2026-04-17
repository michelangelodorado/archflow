"use client";

import { NodeResizer, type NodeProps } from "@xyflow/react";
import { Zap } from "lucide-react";
import { NodeHandles, type Side } from "./node-handles";
import { NodeIcon } from "./node-icon";

interface NodeData {
  label: string;
  kind: string;
  properties: { technology?: string; [key: string]: unknown };
  [key: string]: unknown;
}

export function CacheNode({ data, selected }: NodeProps) {
  const d = data as NodeData;
  const logo = d.logo as string | undefined;
  return (
    <>
      <NodeHandles color="#c084fc" dualSides={(d.dualSides as Side[]) ?? []} />
      <div className={`px-4 py-3 rounded-lg border-2 bg-card shadow-sm min-w-[160px] min-h-[60px] h-full text-center flex flex-col justify-center items-center
        ${selected ? "border-primary ring-2 ring-primary/20" : "border-purple-300"}`}
      >
        <NodeResizer isVisible={!!selected} minWidth={160} minHeight={60} />
        <div className="flex items-center gap-2 justify-center">
          <NodeIcon logo={logo} FallbackIcon={Zap} className="w-4 h-4 text-purple-500 flex-shrink-0" />
          <span className="text-sm font-medium text-card-foreground">{d.label}</span>
        </div>
        {d.properties?.technology && (
          <div className="text-xs text-card-muted mt-1">{d.properties.technology}</div>
        )}
      </div>
    </>
  );
}
