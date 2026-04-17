"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { NodeProps } from "@xyflow/react";

interface TextData {
  label: string;
  kind: string;
  rotation?: number;
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  properties: { [key: string]: unknown };
  [key: string]: unknown;
}

export function TextNode({ data, selected }: NodeProps) {
  const d = data as TextData;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(d.label);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    d.label = text || "Text";
  }, [text, d]);

  const rotation = d.rotation ?? 0;
  const fontWeight = d.bold ? "bold" : undefined;
  const fontStyle = d.italic ? "italic" : undefined;
  const fontSize = d.fontSize ?? 14;

  return (
    <div
      className={`min-w-[80px] min-h-[30px] h-full ${selected ? "ring-2 ring-primary/20 rounded" : ""}`}
      style={{
        ...(rotation ? { transform: `rotate(${rotation}deg)` } : {}),
        fontWeight,
        fontStyle,
        fontSize,
      }}
      onDoubleClick={() => setEditing(true)}
    >
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
          className="w-full h-full bg-transparent text-foreground resize-none outline-none p-1"
          style={{ fontWeight, fontStyle, fontSize }}
        />
      ) : (
        <div className="text-foreground whitespace-pre-wrap p-1">
          {d.label}
        </div>
      )}
    </div>
  );
}
