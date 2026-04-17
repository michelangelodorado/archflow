"use client";

import { Fragment, useEffect } from "react";
import { Handle, Position, useNodeId, useUpdateNodeInternals } from "@xyflow/react";
import { useEditorStore } from "@/lib/store/editor-store";

export type Side = "top" | "bottom" | "left" | "right";

interface NodeHandlesProps {
  color: string; // CSS color value, e.g. "#60a5fa"
  /** Sides that show separate in + out handles. Other sides show a single bidirectional handle. */
  dualSides?: Side[];
}

const positionMap: Record<Side, Position> = {
  top: Position.Top,
  bottom: Position.Bottom,
  left: Position.Left,
  right: Position.Right,
};

/**
 * Renders handles on all 4 sides of a node.
 * - Single (default): one centered handle (type="source", works bidirectionally with Loose mode).
 * - Dual: two handles per side — target (in) offset at 40%, source (out) offset at 60%.
 */
export function NodeHandles({ color, dualSides = [] }: NodeHandlesProps) {
  const nodeId = useNodeId();
  const updateNodeInternals = useUpdateNodeInternals();

  // When dualSides changes, the set of Handle components changes (different IDs/types).
  // React Flow only recalculates handleBounds on dimension changes, so we must
  // explicitly trigger an update so the new handles are registered for connections.
  const dualKey = dualSides.join(",");
  useEffect(() => {
    if (nodeId) {
      updateNodeInternals(nodeId);
    }
  }, [nodeId, dualKey, updateNodeInternals]);

  const handlesVisible = useEditorStore((state) => state.handlesVisible);
  const s = { background: color, width: 10, height: 10, zIndex: 10, opacity: handlesVisible ? 1 : 0, transition: "opacity 0.2s ease" };
  const dualSet = new Set(dualSides);

  const sides: Side[] = ["top", "bottom", "left", "right"];
  const isHorizontal = (side: Side) => side === "top" || side === "bottom";

  return (
    <>
      {sides.map((side) => {
        const pos = positionMap[side];
        const offsetProp = isHorizontal(side) ? "left" : "top";

        if (dualSet.has(side)) {
          const inStyle = { ...s, [offsetProp]: "35%" };
          const outStyle = { ...s, [offsetProp]: "65%" };
          return (
            <Fragment key={side}>
              <Handle type="source" id={`${side}-in`} position={pos} style={inStyle} />
              <Handle type="source" id={`${side}-out`} position={pos} style={outStyle} />
            </Fragment>
          );
        }

        return (
          <Handle key={side} type="source" id={side} position={pos} style={s} />
        );
      })}
    </>
  );
}
