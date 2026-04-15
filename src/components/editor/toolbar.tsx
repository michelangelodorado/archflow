"use client";

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/store/editor-store";
import { updateDiagram } from "@/lib/services/diagram-service";
import { useRouter } from "next/navigation";

export function Toolbar() {
  const router = useRouter();
  const {
    diagram,
    diagramId,
    isDirty,
    isSaving,
    setSaving,
    setDirty,
    syncToCanonical,
    togglePalette,
    toggleInspector,
  } = useEditorStore();

  const handleSave = async () => {
    if (!diagram || !diagramId) return;
    syncToCanonical();
    setSaving(true);

    // TODO: Replace with API call to persist to Postgres
    const current = useEditorStore.getState().diagram;
    if (current) {
      updateDiagram(diagramId, current, "Manual save");
    }

    // Simulate save delay
    await new Promise((r) => setTimeout(r, 300));
    setSaving(false);
    setDirty(false);
  };

  return (
    <div className="h-12 border-b border-border bg-background flex items-center justify-between px-4 shrink-0">
      {/* Left: back + title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/diagrams")} title="Back to library">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <h1 className="text-sm font-semibold truncate max-w-xs">{diagram?.title ?? "Untitled"}</h1>
        {isDirty && <span className="text-xs text-muted-foreground">(unsaved)</span>}
      </div>

      {/* Center: quick actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={togglePalette}>
          Palette
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleInspector}>
          Inspector
        </Button>
      </div>

      {/* Right: save */}
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleSave} disabled={!isDirty || isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
