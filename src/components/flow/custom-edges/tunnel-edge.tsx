"use client";

import { BaseEdge, EdgeLabelRenderer, getBezierPath, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

export function TunnelEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  label,
  selected,
}: EdgeProps) {
  const pathType = (data?.pathType as string) ?? "bezier";
  const arrowEnd = (data?.arrowEnd as string) ?? "none";
  const dimmed = data?.dimmed === true;
  const highlighted = data?.highlighted === true;

  const pathParams = { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition };
  const [edgePath, labelX, labelY] = pathType === "smoothstep"
    ? getSmoothStepPath(pathParams)
    : getBezierPath(pathParams);

  const highlightColor = (data?.highlightColor as string) ?? "#10b981";
  const baseColor = selected ? "#10b981" : highlighted ? highlightColor : "#34d399";
  const edgeColor = dimmed ? "#d1d5db" : baseColor;
  const outerColor = dimmed ? "#e5e7eb" : (selected ? "#6ee7b7" : highlighted ? highlightColor + "60" : "#a7f3d0");

  const markerId = `tunnel-arrow-${id}`;
  const markerStartId = `tunnel-arrow-start-${id}`;
  const showEnd = arrowEnd === "end" || arrowEnd === "both";
  const showStart = arrowEnd === "start" || arrowEnd === "both";

  return (
    <>
      <defs>
        {showEnd && (
          <marker
            id={markerId}
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M2,2 L10,6 L2,10 Z" fill={edgeColor} stroke="none" />
          </marker>
        )}
        {showStart && (
          <marker
            id={markerStartId}
            markerWidth="12"
            markerHeight="12"
            refX="2"
            refY="6"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M10,2 L2,6 L10,10 Z" fill={edgeColor} stroke="none" />
          </marker>
        )}
      </defs>
      {/* Outer line (tunnel casing) */}
      <BaseEdge
        id={`${id}-outer`}
        path={edgePath}
        style={{
          stroke: outerColor,
          strokeWidth: highlighted ? 10 : selected ? 9 : 8,
          strokeLinecap: "round",
          opacity: dimmed ? 0.15 : 0.5,
          transition: "opacity 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease",
        }}
      />
      {/* Inner line (tunnel core) */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: edgeColor,
          strokeWidth: highlighted ? 3 : selected ? 2.5 : 2,
          strokeDasharray: "8 4",
          opacity: dimmed ? 0.15 : 1,
          transition: "opacity 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease",
        }}
        markerEnd={showEnd ? `url(#${markerId})` : undefined}
        markerStart={showStart ? `url(#${markerStartId})` : undefined}
      />
      {/* Label with lock icon */}
      <EdgeLabelRenderer>
        <div
          className="absolute flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-700 dark:text-emerald-300 shadow-sm pointer-events-all"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            zIndex: 1000,
            opacity: dimmed ? 0.15 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {((label as string) || (data?.label as string)) || "IPSec"}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
