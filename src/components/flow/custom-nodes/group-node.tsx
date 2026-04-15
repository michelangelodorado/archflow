"use client";

import { NodeResizer, type NodeProps } from "@xyflow/react";

interface GroupData {
  label: string;
  kind: string;
  properties: { [key: string]: unknown };
  [key: string]: unknown;
}

const alignClass: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const DEFAULT_BORDER_COLOR = "#a5b4fc"; // indigo-300
const DEFAULT_FILL_COLOR = "#eef2ff";  // indigo-50

export function GroupNode({ data, selected }: NodeProps) {
  const d = data as GroupData;
  const align = (d.labelAlign as string) ?? "left";
  const borderStyle = (d.borderStyle as string) ?? "dashed";
  const borderColor = (d.borderColor as string) ?? DEFAULT_BORDER_COLOR;
  const fillColor = (d.fillColor as string) ?? DEFAULT_FILL_COLOR;

  return (
    <div
      className={`rounded-xl border-2 min-w-[300px] min-h-[200px] w-full h-full
        ${borderStyle === "solid" ? "border-solid" : "border-dashed"}
        ${selected ? "ring-2 ring-primary/20" : ""}`}
      style={{
        borderColor: selected ? "var(--primary)" : borderColor,
        backgroundColor: `${fillColor}80`,
      }}
    >
      <NodeResizer
        isVisible={!!selected}
        minWidth={300}
        minHeight={200}
        lineStyle={{ borderColor }}
        handleStyle={{ background: borderColor, borderColor }}
      />
      <div className={`px-3 py-2 ${alignClass[align] ?? "text-left"}`}>
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: borderColor }}
        >
          {d.label}
        </span>
      </div>
    </div>
  );
}
