"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { NodeResizer, Handle, Position, type NodeProps } from "@xyflow/react";

type PointerDirection = "top" | "bottom" | "left" | "right";

interface CalloutData {
  label: string;
  kind: string;
  pointerDirection?: PointerDirection;
  bgColor?: string;
  borderColor?: string;
  properties: { [key: string]: unknown };
  [key: string]: unknown;
}

const POINTER_SIZE = 10;

function getPointerPath(dir: PointerDirection): string {
  // Returns an SVG polygon pointing outward from the given side
  switch (dir) {
    case "top":
      return `${-POINTER_SIZE},0 0,${-POINTER_SIZE} ${POINTER_SIZE},0`;
    case "bottom":
      return `${-POINTER_SIZE},0 0,${POINTER_SIZE} ${POINTER_SIZE},0`;
    case "left":
      return `0,${-POINTER_SIZE} ${-POINTER_SIZE},0 0,${POINTER_SIZE}`;
    case "right":
      return `0,${-POINTER_SIZE} ${POINTER_SIZE},0 0,${POINTER_SIZE}`;
  }
}

function getPointerStyle(dir: PointerDirection) {
  const base: React.CSSProperties = { position: "absolute" };
  switch (dir) {
    case "top":
      return { ...base, top: -POINTER_SIZE, left: "50%", transform: "translateX(-50%)" };
    case "bottom":
      return { ...base, bottom: -POINTER_SIZE, left: "50%", transform: "translateX(-50%)" };
    case "left":
      return { ...base, left: -POINTER_SIZE, top: "50%", transform: "translateY(-50%)" };
    case "right":
      return { ...base, right: -POINTER_SIZE, top: "50%", transform: "translateY(-50%)" };
  }
}

const handlePosition: Record<PointerDirection, Position> = {
  top: Position.Top,
  bottom: Position.Bottom,
  left: Position.Left,
  right: Position.Right,
};

export function CalloutNode({ data, selected }: NodeProps) {
  const d = data as CalloutData;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(d.label);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const pointerDir: PointerDirection = d.pointerDirection ?? "bottom";
  const bgColor = d.bgColor ?? "#f3f4f6";
  const borderColor = d.borderColor ?? "#9ca3af";

  useEffect(() => {
    setText(d.label);
  }, [d.label]);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editing]);

  const commit = useCallback(() => {
    setEditing(false);
    d.label = text || "Callout";
  }, [text, d]);

  return (
    <div className="relative" style={{ minWidth: 120, minHeight: 48 }}>
      {/* Connection handle on the pointer side */}
      <Handle
        type="source"
        id={pointerDir}
        position={handlePosition[pointerDir]}
        style={{ background: borderColor, width: 10, height: 10, zIndex: 10 }}
      />

      {/* Pointer nub */}
      <div style={getPointerStyle(pointerDir)}>
        <svg
          width={POINTER_SIZE * 2}
          height={POINTER_SIZE * 2}
          viewBox={`${-POINTER_SIZE} ${-POINTER_SIZE} ${POINTER_SIZE * 2} ${POINTER_SIZE * 2}`}
          style={{ display: "block" }}
        >
          <polygon
            points={getPointerPath(pointerDir)}
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          {/* Cover the border where the pointer meets the box */}
          {(pointerDir === "top" || pointerDir === "bottom") && (
            <line
              x1={-POINTER_SIZE}
              y1={0}
              x2={POINTER_SIZE}
              y2={0}
              stroke={bgColor}
              strokeWidth={2}
            />
          )}
          {(pointerDir === "left" || pointerDir === "right") && (
            <line
              x1={0}
              y1={-POINTER_SIZE}
              x2={0}
              y2={POINTER_SIZE}
              stroke={bgColor}
              strokeWidth={2}
            />
          )}
        </svg>
      </div>

      {/* Main callout body */}
      <div
        className={`rounded-lg shadow-sm h-full ${selected ? "ring-2 ring-primary/30" : ""}`}
        style={{
          backgroundColor: bgColor,
          border: `1.5px solid ${borderColor}`,
          minWidth: 120,
          minHeight: 48,
        }}
        onDoubleClick={() => setEditing(true)}
      >
        <NodeResizer isVisible={!!selected} minWidth={120} minHeight={48} />
        {editing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey)) {
                e.preventDefault();
                commit();
              }
            }}
            className="w-full h-full bg-transparent text-sm resize-none outline-none px-3 py-2"
            style={{ color: "inherit" }}
          />
        ) : (
          <div className="text-sm whitespace-pre-wrap px-3 py-2" style={{ color: "#1c1917" }}>
            {d.label}
          </div>
        )}
      </div>
    </div>
  );
}
