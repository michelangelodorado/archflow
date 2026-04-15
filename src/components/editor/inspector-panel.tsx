"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/store/editor-store";
import { iconMap, iconNames } from "@/components/flow/icon-picker";

export function InspectorPanel() {
  const { nodes, edges, selectedNodeId, selectedEdgeId, updateNodeData, updateEdgeLabel, updateEdgeAnimated, updateEdgePathType, updateEdgeArrow, setNodeParent, removeNode, removeEdge } =
    useEditorStore();

  const groupNodes = nodes.filter((n) => (n.data as Record<string, unknown>).kind === "group");

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) : null;

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-64 border-l border-border bg-background p-4 shrink-0 overflow-y-auto">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Inspector
        </h2>
        <p className="text-sm text-muted-foreground">Select a node or edge to inspect its properties.</p>
      </div>
    );
  }

  if (selectedNode) {
    const data = selectedNode.data as Record<string, unknown>;
    const properties = (data.properties ?? {}) as Record<string, string>;
    const isGroup = data.kind === "group";

    // --- Group node inspector ---
    if (isGroup) {
      const childCount = nodes.filter((n) => n.parentId === selectedNode.id).length;

      // Collect all descendant IDs to prevent circular nesting
      const getDescendantIds = (id: string): Set<string> => {
        const desc = new Set<string>();
        for (const n of nodes) {
          if (n.parentId === id) {
            desc.add(n.id);
            for (const d of getDescendantIds(n.id)) desc.add(d);
          }
        }
        return desc;
      };
      const descendantIds = getDescendantIds(selectedNode.id);
      const eligibleParents = groupNodes.filter(
        (g) => g.id !== selectedNode.id && !descendantIds.has(g.id),
      );

      return (
        <div className="w-64 border-l border-border bg-background p-4 shrink-0 overflow-y-auto">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Group Inspector
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Label</label>
              <Input
                value={(data.label as string) ?? ""}
                onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                className="mt-1"
                placeholder="e.g. Data Center 1, Public Cloud"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Label Align</label>
              <div className="flex gap-1.5 mt-1">
                {(["left", "center", "right"] as const).map((align) => {
                  const current = (data.labelAlign as string) ?? "left";
                  return (
                    <button
                      key={align}
                      onClick={() => updateNodeData(selectedNode.id, { labelAlign: align })}
                      className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md border transition-colors capitalize
                        ${current === align
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:bg-muted"}`}
                    >
                      {align}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Border Style</label>
              <div className="flex gap-1.5 mt-1">
                {(["dashed", "solid"] as const).map((style) => {
                  const current = (data.borderStyle as string) ?? "dashed";
                  return (
                    <button
                      key={style}
                      onClick={() => updateNodeData(selectedNode.id, { borderStyle: style })}
                      className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md border transition-colors capitalize
                        ${current === style
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:bg-muted"}`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Border Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={(data.borderColor as string) ?? "#a5b4fc"}
                  onChange={(e) => updateNodeData(selectedNode.id, { borderColor: e.target.value })}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">{(data.borderColor as string) ?? "#a5b4fc"}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Fill Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={(data.fillColor as string) ?? "#eef2ff"}
                  onChange={(e) => updateNodeData(selectedNode.id, { fillColor: e.target.value })}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">{(data.fillColor as string) ?? "#eef2ff"}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Children</label>
              <div className="text-sm mt-1 px-3 py-1.5 bg-muted rounded-md">
                {childCount} {childCount === 1 ? "node" : "nodes"}
              </div>
            </div>
            {eligibleParents.length > 0 && (
              <div className="pt-2 border-t border-border">
                <label className="text-xs font-medium text-muted-foreground">Parent Group</label>
                <select
                  value={selectedNode.parentId ?? ""}
                  onChange={(e) => setNodeParent(selectedNode.id, e.target.value || null)}
                  className="mt-1 w-full px-3 py-1.5 text-sm bg-background border border-border rounded-md"
                >
                  <option value="">None</option>
                  {eligibleParents.map((g) => (
                    <option key={g.id} value={g.id}>
                      {(g.data as Record<string, unknown>).label as string}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="pt-2 border-t border-border">
              <Button variant="destructive" size="sm" onClick={() => removeNode(selectedNode.id)}>
                Delete Group
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // --- Regular node inspector ---
    return (
      <div className="w-64 border-l border-border bg-background p-4 shrink-0 overflow-y-auto">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Node Inspector
        </h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Label</label>
            <Input
              value={(data.label as string) ?? ""}
              onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Kind</label>
            <div className="text-sm mt-1 px-3 py-1.5 bg-muted rounded-md">{data.kind as string}</div>
          </div>

          {data.kind === "generic" && <IconPickerField nodeId={selectedNode.id} currentIcon={(data.icon as string) ?? ""} />}

          <div>
            <label className="text-xs font-medium text-muted-foreground">Technology</label>
            <Input
              value={properties.technology ?? ""}
              onChange={(e) =>
                updateNodeData(selectedNode.id, {
                  properties: { ...properties, technology: e.target.value },
                })
              }
              className="mt-1"
              placeholder="e.g. Node.js, PostgreSQL"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <Input
              value={properties.description ?? ""}
              onChange={(e) =>
                updateNodeData(selectedNode.id, {
                  properties: { ...properties, description: e.target.value },
                })
              }
              className="mt-1"
              placeholder="What does this component do?"
            />
          </div>

          {groupNodes.length > 0 && (
            <div className="pt-2 border-t border-border">
              <label className="text-xs font-medium text-muted-foreground">Group</label>
              <select
                value={selectedNode.parentId ?? ""}
                onChange={(e) => setNodeParent(selectedNode.id, e.target.value || null)}
                className="mt-1 w-full px-3 py-1.5 text-sm bg-background border border-border rounded-md"
              >
                <option value="">None</option>
                {groupNodes.map((g) => (
                  <option key={g.id} value={g.id}>
                    {(g.data as Record<string, unknown>).label as string}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-2 border-t border-border">
            <label className="text-xs font-medium text-muted-foreground">Dual Handles (In + Out)</label>
            <p className="text-xs text-muted-foreground mt-0.5 mb-2">
              Toggle sides that need separate in/out handles.
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {(["top", "bottom", "left", "right"] as const).map((side) => {
                const dualSides = ((data.dualSides as string[]) ?? []);
                const isActive = dualSides.includes(side);
                return (
                  <button
                    key={side}
                    onClick={() => {
                      const next = isActive
                        ? dualSides.filter((s: string) => s !== side)
                        : [...dualSides, side];
                      updateNodeData(selectedNode.id, { dualSides: next });
                    }}
                    className={`px-2 py-1.5 text-xs font-medium rounded-md border transition-colors capitalize
                      ${isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-muted"}`}
                  >
                    {side}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <Button variant="destructive" size="sm" onClick={() => removeNode(selectedNode.id)}>
              Delete Node
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedEdge) {
    const data = selectedEdge.data as Record<string, unknown> | undefined;
    return (
      <div className="w-64 border-l border-border bg-background p-4 shrink-0 overflow-y-auto">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Edge Inspector
        </h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Label</label>
            <Input
              value={(data?.label as string) ?? (selectedEdge.label as string) ?? ""}
              onChange={(e) => updateEdgeLabel(selectedEdge.id, e.target.value)}
              className="mt-1"
              placeholder="e.g. REST API, gRPC"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Kind</label>
            <div className="text-sm mt-1 px-3 py-1.5 bg-muted rounded-md">{(data?.kind as string) ?? "—"}</div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Animation</label>
            <div className="flex gap-1.5 mt-1">
              <button
                onClick={() => updateEdgeAnimated(selectedEdge.id, true)}
                className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md border transition-colors
                  ${selectedEdge.animated
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-muted"}`}
              >
                Animated
              </button>
              <button
                onClick={() => updateEdgeAnimated(selectedEdge.id, false)}
                className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md border transition-colors
                  ${!selectedEdge.animated
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-muted"}`}
              >
                None
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Path</label>
            <div className="flex gap-1.5 mt-1">
              {(["bezier", "smoothstep"] as const).map((type) => {
                const current = (data?.pathType as string) ?? "bezier";
                return (
                  <button
                    key={type}
                    onClick={() => updateEdgePathType(selectedEdge.id, type)}
                    className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md border transition-colors capitalize
                      ${current === type
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-muted"}`}
                  >
                    {type === "smoothstep" ? "Smooth Step" : "Bezier"}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Arrows</label>
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              {(["none", "end", "start", "both"] as const).map((opt) => {
                const current = (data?.arrowEnd as string) ?? "none";
                const labels: Record<string, string> = { none: "None", end: "End", start: "Start", both: "Both" };
                return (
                  <button
                    key={opt}
                    onClick={() => updateEdgeArrow(selectedEdge.id, opt)}
                    className={`px-2 py-1.5 text-xs font-medium rounded-md border transition-colors
                      ${current === opt
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-muted"}`}
                  >
                    {labels[opt]}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Source → Target</label>
            <div className="text-sm mt-1 px-3 py-1.5 bg-muted rounded-md">
              {selectedEdge.source} → {selectedEdge.target}
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => removeEdge(selectedEdge.id)}
          >
            Delete Edge
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

function IconPickerField({ nodeId, currentIcon }: { nodeId: string; currentIcon: string }) {
  const updateNodeData = useEditorStore((s) => s.updateNodeData);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = search
    ? iconNames.filter((name) => name.includes(search.toLowerCase()))
    : iconNames;

  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">Icon</label>
      <button
        onClick={() => setOpen(!open)}
        className="mt-1 w-full flex items-center gap-2 px-3 py-1.5 text-sm bg-background border border-border rounded-md hover:bg-muted transition-colors"
      >
        {currentIcon && iconMap[currentIcon] ? (
          <>
            {(() => { const I = iconMap[currentIcon]; return <I className="w-4 h-4 text-gray-500" />; })()}
            <span>{currentIcon}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Select icon...</span>
        )}
      </button>
      {open && (
        <div className="mt-1 border border-border rounded-md bg-background shadow-lg">
          <div className="p-2 border-b border-border">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons..."
              className="h-7 text-xs"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-6 gap-1 p-2 max-h-48 overflow-y-auto">
            {filtered.map((name) => {
              const Icon = iconMap[name];
              return (
                <button
                  key={name}
                  title={name}
                  onClick={() => {
                    updateNodeData(nodeId, { icon: name });
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`p-1.5 rounded hover:bg-muted transition-colors
                    ${currentIcon === name ? "bg-primary/10 ring-1 ring-primary" : ""}`}
                >
                  <Icon className="w-4 h-4 text-gray-600 mx-auto" />
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-6 py-2 text-xs text-muted-foreground text-center">No matches</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
