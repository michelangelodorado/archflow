"use client";

import { BaseEdge, EdgeLabelRenderer, getBezierPath, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

export function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  label,
  animated,
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

  const highlightColor = (data?.highlightColor as string) ?? "#3b82f6";
  const baseColor = selected ? "#3b82f6" : highlighted ? highlightColor : "#94a3b8";
  const edgeColor = dimmed ? "#d1d5db" : baseColor;
  const markerId = `arrow-${id}`;
  const markerStartId = `arrow-start-${id}`;
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
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: edgeColor,
          strokeWidth: highlighted ? 3 : selected ? 2.5 : 1.5,
          opacity: dimmed ? 0.15 : 1,
          transition: "opacity 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease",
        }}
        markerEnd={showEnd ? `url(#${markerId})` : undefined}
        markerStart={showStart ? `url(#${markerStartId})` : undefined}
      />
      {/* Animated dots overlay */}
      {animated && (
        <path
          d={edgePath}
          fill="none"
          stroke={edgeColor}
          strokeWidth={2}
          strokeDasharray="6 8"
          className="animated-edge-path"
          style={{ opacity: dimmed ? 0.15 : 1, transition: "opacity 0.3s ease" }}
        />
      )}
      {/* Label */}
      {(label || data?.label) && (
        <EdgeLabelRenderer>
          <div
            className="absolute px-2 py-0.5 rounded bg-card border border-border text-xs text-muted-foreground shadow-sm pointer-events-all"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              opacity: dimmed ? 0.15 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            {(label as string) || (data?.label as string)}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
