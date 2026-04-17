"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useEditorStore } from "@/lib/store/editor-store";

export function FlowPanel() {
  const { flows, activeFlowId, nodes, selectedNodeId, saveFlow, activateFlow, removeFlow } =
    useEditorStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const hasSelection = nodes.some((n) => n.selected) || !!selectedNodeId;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    saveFlow(name);
    setNewName("");
    setIsCreating(false);
  };

  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-md min-w-[200px] max-w-[260px]">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <span className="text-xs font-semibold text-card-foreground">Flows</span>
        {activeFlowId && (
          <button
            onClick={() => activateFlow(null)}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="p-1.5 space-y-0.5">
        {flows.length === 0 && !isCreating && (
          <div className="px-2 py-2 text-[11px] text-muted-foreground text-center leading-relaxed">
            Select nodes (Shift+click) then
            <br />
            save as a flow to highlight them
          </div>
        )}

        {flows.map((flow) => {
          const isActive = flow.id === activeFlowId;
          return (
            <div
              key={flow.id}
              className={`group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs transition-colors ${
                isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 text-card-foreground"
              }`}
              onClick={() => activateFlow(isActive ? null : flow.id)}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-black/10"
                style={{ backgroundColor: flow.color }}
              />
              <span className="flex-1 truncate font-medium">{flow.name}</span>
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {flow.nodeIds.length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFlow(flow.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {isCreating ? (
          <form onSubmit={handleSave} className="flex gap-1 px-1 pt-1">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => {
                if (!newName.trim()) setIsCreating(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsCreating(false);
              }}
              placeholder="Flow name..."
              className="flex-1 min-w-0 px-2 py-1 text-xs rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="px-2 py-1 text-xs rounded bg-primary text-primary-foreground disabled:opacity-40"
            >
              Save
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            disabled={!hasSelection}
            className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs text-muted-foreground hover:text-card-foreground hover:bg-accent/50 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-3 h-3" />
            Save Selection as Flow
          </button>
        )}
      </div>
    </div>
  );
}
