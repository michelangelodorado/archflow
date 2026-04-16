"use client";

import { useMemo } from "react";
import { getDiagram } from "@/lib/services/diagram-service";

const kindColors: Record<string, string> = {
  service: "#3b82f6",
  database: "#22c55e",
  queue: "#f97316",
  cache: "#a855f7",
  "load-balancer": "#f59e0b",
  cdn: "#0ea5e9",
  storage: "#14b8a6",
  client: "#6366f1",
  function: "#f43f5e",
  gateway: "#06b6d4",
  cloud: "#38bdf8",
  security: "#f87171",
  group: "#818cf8",
  generic: "#94a3b8",
};

const NODE_W = 40;
const NODE_H = 28;
const PAD = 30;

interface DiagramPreviewProps {
  diagramId: string;
}

export function DiagramPreview({ diagramId }: DiagramPreviewProps) {
  const diagram = useMemo(() => getDiagram(diagramId), [diagramId]);

  if (!diagram || diagram.layout.positions.length === 0) {
    return <FallbackIcon />;
  }

  const { positions } = diagram.layout;
  const entityMap = new Map(diagram.entities.map((e) => [e.id, e]));
  const posMap = new Map(positions.map((p) => [p.entityId, p.position]));

  // Bounding box
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const p of positions) {
    minX = Math.min(minX, p.position.x);
    minY = Math.min(minY, p.position.y);
    maxX = Math.max(maxX, p.position.x + NODE_W);
    maxY = Math.max(maxY, p.position.y + NODE_H);
  }

  const vbX = minX - PAD;
  const vbY = minY - PAD;
  const vbW = maxX - minX + PAD * 2;
  const vbH = maxY - minY + PAD * 2;

  return (
    <svg
      viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
    >
      {/* Edges */}
      {diagram.relationships.map((rel) => {
        const from = posMap.get(rel.from);
        const to = posMap.get(rel.to);
        if (!from || !to) return null;
        return (
          <line
            key={rel.id}
            x1={from.x + NODE_W / 2}
            y1={from.y + NODE_H / 2}
            x2={to.x + NODE_W / 2}
            y2={to.y + NODE_H / 2}
            stroke="#cbd5e1"
            strokeWidth={2}
          />
        );
      })}
      {/* Nodes */}
      {positions.map((pos) => {
        const entity = entityMap.get(pos.entityId);
        if (!entity) return null;
        const color = kindColors[entity.kind] ?? "#94a3b8";
        return (
          <rect
            key={pos.entityId}
            x={pos.position.x}
            y={pos.position.y}
            width={NODE_W}
            height={NODE_H}
            rx={4}
            fill={color}
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
}

function FallbackIcon() {
  return (
    <svg
      className="w-12 h-12 text-muted-foreground/40"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  );
}
