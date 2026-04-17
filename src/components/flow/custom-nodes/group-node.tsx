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

const LIGHT_BORDER = "#9ca3af"; // gray-400
const LIGHT_FILL = "#f3f4f6";  // gray-100
const DARK_BORDER = "#4b5563";  // gray-600
const DARK_FILL = "#1f2937";    // gray-800

export function GroupNode({ data, selected }: NodeProps) {
  const d = data as GroupData;
  const align = (d.labelAlign as string) ?? "left";
  const borderStyle = (d.borderStyle as string) ?? "dashed";
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const borderColor = (d.borderColor as string) ?? (isDark ? DARK_BORDER : LIGHT_BORDER);
  const fillColor = (d.fillColor as string) ?? (isDark ? DARK_FILL : LIGHT_FILL);
  const highlightColor = d.highlightColor as string | undefined;

  return (
    <div
      className={`rounded-xl min-w-[300px] min-h-[200px] w-full h-full backdrop-blur-sm
        ${borderStyle === "solid" ? "border-solid" : "border-dashed"}
        ${selected ? "ring-2 ring-primary/20" : ""}`}
      style={{
        borderWidth: highlightColor ? 3 : 2,
        borderColor: selected ? "var(--primary)" : highlightColor ?? borderColor,
        backgroundColor: isDark ? `${fillColor}60` : `${fillColor}80`,
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
          style={{ color: isDark ? "#f9fafb" : borderColor }}
        >
          {d.label}
        </span>
      </div>
    </div>
  );
}
