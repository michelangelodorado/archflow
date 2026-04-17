"use client";

import { useState } from "react";
import { ChevronRight, Plus, X, Pencil, Check } from "lucide-react";
import { useEditorStore } from "@/lib/store/editor-store";

export function FlowPanel() {
  const { flows, activeFlowId, editingFlowId, nodes, selectedNodeId, setNodes, saveFlow, activateFlow, setEditingFlowId, updateFlowNodes, removeFlow } =
    useEditorStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const hasSelection = nodes.some((n) => n.selected) || !!selectedNodeId;

  const startEditing = (flowId: string) => {
    const flow = flows.find((f) => f.id === flowId);
    if (!flow) return;
    const nodeIdSet = new Set(flow.nodeIds);
    setNodes(nodes.map((n) => ({ ...n, selected: nodeIdSet.has(n.id) })));
    setEditingFlowId(flowId);
    activateFlow(flowId);
  };

  const handleSaveEdit = () => {
    if (!editingFlowId) return;
    const selectedIds = nodes
      .filter((n) => n.selected || n.id === selectedNodeId)
      .map((n) => n.id);
    if (selectedIds.length === 0) return;
    updateFlowNodes(editingFlowId, selectedIds);
    setEditingFlowId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    saveFlow(name);
    setNewName("");
    setIsCreating(false);
  };

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-md px-2.5 py-2 flex items-center gap-1.5 hover:bg-accent/50 transition-colors"
      >
        <ChevronRight className="w-3 h-3 rotate-180 text-muted-foreground" />
        <span className="text-xs font-semibold text-card-foreground">Flows</span>
        {flows.length > 0 && (
          <span className="text-[10px] text-muted-foreground tabular-nums">{flows.length}</span>
        )}
      </button>
    );
  }

  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-md min-w-[200px] max-w-[260px]">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </button>
          <span className="text-xs font-semibold text-card-foreground">Flows</span>
        </div>
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
          const isBeingEdited = editingFlowId === flow.id;
          return (
            <div
              key={flow.id}
              className={`group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs transition-colors ${
                isBeingEdited ? "bg-primary/10 ring-1 ring-primary text-card-foreground" :
                isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 text-card-foreground"
              }`}
              onClick={() => !isBeingEdited && activateFlow(isActive ? null : flow.id)}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-black/10"
                style={{ backgroundColor: flow.color }}
              />
              <span className="flex-1 truncate font-medium">{flow.name}</span>
              {isBeingEdited ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveEdit();
                  }}
                  disabled={!hasSelection}
                  className="text-primary hover:text-primary/80 transition-colors disabled:opacity-40"
                  title="Save selection to flow"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              ) : (
                <>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {flow.nodeIds.length}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(flow.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
                    title="Edit flow nodes"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFlow(flow.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          );
        })}

        {editingFlowId && (
          <div className="px-2 py-1.5 text-[10px] text-muted-foreground text-center leading-relaxed">
            Click nodes to add/remove, then
            <br />
            press <Check className="w-2.5 h-2.5 inline" /> to save
          </div>
        )}

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
