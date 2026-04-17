"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
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
    const isText = data.kind === "text";
    const isCallout = data.kind === "callout";

    // --- Text node inspector ---
    if (isText) {
      const rotation = (data.rotation as number) ?? 0;
      const isBold = (data.bold as boolean) ?? false;
      const isItalic = (data.italic as boolean) ?? false;
      return (
        <div className="w-64 border-l border-border bg-background p-4 shrink-0 overflow-y-auto">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Text Inspector
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Label</label>
              <Input
                value={(data.label as string) ?? ""}
                onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                className="mt-1"
                placeholder="Text content"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Style</label>
              <div className="flex gap-1.5 mt-1">
                <button
                  onClick={() => updateNodeData(selectedNode.id, { bold: !isBold })}
                  className={`flex-1 px-2 py-1.5 text-xs font-bold rounded-md border transition-colors
                    ${isBold
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"}`}
                >
                  Bold
                </button>
                <button
                  onClick={() => updateNodeData(selectedNode.id, { italic: !isItalic })}
                  className={`flex-1 px-2 py-1.5 text-xs italic rounded-md border transition-colors
                    ${isItalic
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"}`}
                >
                  Italic
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Font Size</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min={8}
                  max={72}
                  step={1}
                  value={(data.fontSize as number) ?? 14}
                  onChange={(e) => updateNodeData(selectedNode.id, { fontSize: Number(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-10 text-right">{(data.fontSize as number) ?? 14}px</span>
              </div>
              <div className="flex gap-1.5 mt-1.5">
                {[12, 14, 18, 24, 32, 48].map((size) => (
                  <button
                    key={size}
                    onClick={() => updateNodeData(selectedNode.id, { fontSize: size })}
                    className={`flex-1 px-1 py-1 text-xs font-medium rounded-md border transition-colors
                      ${(data.fontSize as number ?? 14) === size
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-muted"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Rotation</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min={-180}
                  max={180}
                  step={1}
                  value={rotation}
                  onChange={(e) => updateNodeData(selectedNode.id, { rotation: Number(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-10 text-right">{rotation}°</span>
              </div>
              <div className="flex gap-1.5 mt-1.5">
                {[0, 45, 90, -45, -90].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => updateNodeData(selectedNode.id, { rotation: deg })}
                    className={`flex-1 px-1 py-1 text-xs font-medium rounded-md border transition-colors
                      ${rotation === deg
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-muted"}`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <Button variant="destructive" size="sm" onClick={() => removeNode(selectedNode.id)}>
                Delete Text
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // --- Callout node inspector ---
    if (isCallout) {
      return (
        <div className="w-64 border-l border-border bg-background p-4 shrink-0 overflow-y-auto">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Callout Inspector
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Label</label>
              <Input
                value={(data.label as string) ?? ""}
                onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                className="mt-1"
                placeholder="Callout text"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Pointer Direction</label>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {(["top", "bottom", "left", "right"] as const).map((dir) => {
                  const current = (data.pointerDirection as string) ?? "bottom";
                  return (
                    <button
                      key={dir}
                      onClick={() => updateNodeData(selectedNode.id, { pointerDirection: dir })}
                      className={`px-2 py-1.5 text-xs font-medium rounded-md border transition-colors capitalize
                        ${current === dir
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:bg-muted"}`}
                    >
                      {dir}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Background Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={(data.bgColor as string) ?? "#fefce8"}
                  onChange={(e) => updateNodeData(selectedNode.id, { bgColor: e.target.value })}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">{(data.bgColor as string) ?? "#fefce8"}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Border Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={(data.borderColor as string) ?? "#facc15"}
                  onChange={(e) => updateNodeData(selectedNode.id, { borderColor: e.target.value })}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">{(data.borderColor as string) ?? "#facc15"}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <Button variant="destructive" size="sm" onClick={() => removeNode(selectedNode.id)}>
                Delete Callout
              </Button>
            </div>
          </div>
        </div>
      );
    }

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
                  value={(data.borderColor as string) ?? "#9ca3af"}
                  onChange={(e) => updateNodeData(selectedNode.id, { borderColor: e.target.value })}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">{(data.borderColor as string) ?? "#9ca3af"}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Fill Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={(data.fillColor as string) ?? "#f3f4f6"}
                  onChange={(e) => updateNodeData(selectedNode.id, { fillColor: e.target.value })}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">{(data.fillColor as string) ?? "#f3f4f6"}</span>
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

          <LogoField nodeId={selectedNode.id} currentLogo={(data.logo as string) ?? ""} />

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

function LogoField({ nodeId, currentLogo }: { nodeId: string; currentLogo: string }) {
  const updateNodeData = useEditorStore((s) => s.updateNodeData);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateNodeData(nodeId, { logo: reader.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">Logo</label>
      {currentLogo ? (
        <div className="mt-1 flex items-center gap-2">
          <img src={currentLogo} alt="" className="w-6 h-6 object-contain rounded" />
          <button
            onClick={() => updateNodeData(nodeId, { logo: undefined })}
            className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground"
            title="Remove logo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="mt-1 flex gap-1">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-background border border-border rounded-md hover:bg-muted transition-colors text-muted-foreground"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload image
          </button>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
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
            {(() => { const I = iconMap[currentIcon]; return <I className="w-4 h-4 text-muted-foreground" />; })()}
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
                  <Icon className="w-4 h-4 text-muted-foreground mx-auto" />
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
