"use client";

import { NodeResizer, type NodeProps } from "@xyflow/react";
import { Shield } from "lucide-react";
import { NodeHandles, type Side } from "./node-handles";

interface SecurityData {
  label: string;
  kind: string;
  properties: { technology?: string; description?: string; [key: string]: unknown };
  [key: string]: unknown;
}

export function SecurityNode({ data, selected }: NodeProps) {
  const d = data as SecurityData;
  return (
    <>
      <NodeHandles color="#f87171" dualSides={(d.dualSides as Side[]) ?? []} />
      <div className={`px-4 py-3 rounded-lg border-2 bg-card shadow-sm min-w-[160px] min-h-[60px] h-full text-center flex flex-col justify-center items-center
        ${selected ? "border-primary ring-2 ring-primary/20" : "border-red-300"}`}
      >
        <NodeResizer isVisible={!!selected} minWidth={160} minHeight={60} />
        <div className="flex items-center gap-2 justify-center">
          <Shield className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-sm font-medium text-card-foreground">{d.label}</span>
        </div>
        {d.properties?.technology && (
          <div className="text-xs text-card-muted mt-1">{d.properties.technology}</div>
        )}
      </div>
    </>
  );
}
