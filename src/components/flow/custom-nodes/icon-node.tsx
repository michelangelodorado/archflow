"use client";

import { NodeResizer, type NodeProps } from "@xyflow/react";
import { LayoutGrid } from "lucide-react";
import { NodeHandles, type Side } from "./node-handles";
import { iconMap } from "@/components/flow/icon-picker";

interface IconData {
  label: string;
  kind: string;
  properties: { [key: string]: unknown };
  [key: string]: unknown;
}

export function IconNode({ data, selected }: NodeProps) {
  const d = data as IconData;
  const nodeColor = (d.nodeColor as string) ?? "#9ca3af";
  const iconKey = d.icon as string | undefined;
  const Icon = (iconKey && iconMap[iconKey]) || LayoutGrid;
  const logo = d.logo as string | undefined;

  return (
    <>
      <NodeHandles color={nodeColor} dualSides={(d.dualSides as Side[]) ?? []} />
      <div
        className={`rounded-lg border-2 bg-card shadow-sm flex items-center justify-center aspect-square
          ${selected ? "border-primary ring-2 ring-primary/20" : ""}`}
        style={{
          width: 64,
          height: 64,
          ...(!selected ? { borderColor: nodeColor + "60" } : {}),
        }}
      >
        <NodeResizer isVisible={!!selected} minWidth={40} minHeight={40} keepAspectRatio />
        {logo ? (
          <img src={logo} alt="" className="w-5 h-5 object-contain" />
        ) : (
          <Icon className="w-5 h-5" style={{ color: nodeColor }} />
        )}
      </div>
    </>
  );
}
