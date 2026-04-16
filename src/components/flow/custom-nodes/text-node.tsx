"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { NodeResizer, type NodeProps } from "@xyflow/react";

interface TextData {
  label: string;
  kind: string;
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

  return (
    <div
      className={`min-w-[80px] min-h-[30px] h-full ${selected ? "ring-2 ring-primary/20 rounded" : ""}`}
      onDoubleClick={() => setEditing(true)}
    >
      <NodeResizer isVisible={!!selected} minWidth={80} minHeight={30} />
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
          className="w-full h-full bg-transparent text-sm text-foreground resize-none outline-none p-1"
        />
      ) : (
        <div className="text-sm text-foreground whitespace-pre-wrap p-1">
          {d.label}
        </div>
      )}
    </div>
  );
}
