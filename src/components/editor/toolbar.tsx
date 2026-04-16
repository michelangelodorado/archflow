"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useEditorStore } from "@/lib/store/editor-store";
import { updateDiagram, exportCanonicalToFile } from "@/lib/services/diagram-service";
import { useRouter } from "next/navigation";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";

export function Toolbar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
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
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorStore();

  const navigateBack = () => router.push("/diagrams");

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

  const handleExport = () => {
    if (!diagram) return;
    syncToCanonical();
    const current = useEditorStore.getState().diagram;
    if (current) {
      exportCanonicalToFile(current);
    }
  };

  const handleBack = () => {
    if (isDirty) {
      setShowUnsavedDialog(true);
    } else {
      navigateBack();
    }
  };

  const handleSaveAndLeave = async () => {
    await handleSave();
    navigateBack();
  };

  const handleLeaveWithoutSaving = () => {
    setShowUnsavedDialog(false);
    navigateBack();
  };

  return (
    <div className="h-12 border-b border-border bg-background flex items-center justify-between px-4 shrink-0">
      {showUnsavedDialog && (
        <UnsavedChangesDialog
          onSaveAndLeave={handleSaveAndLeave}
          onLeaveWithoutSaving={handleLeaveWithoutSaving}
          onCancel={() => setShowUnsavedDialog(false)}
          isSaving={isSaving}
        />
      )}
      {/* Left: back + title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleBack} title="Back to library">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <h1 className="text-sm font-semibold truncate max-w-xs">{diagram?.title ?? "Untitled"}</h1>
        {isDirty && <span className="text-xs text-muted-foreground">(unsaved)</span>}
      </div>

      {/* Center: quick actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo}>
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Redo (Ctrl+Shift+Z)" onClick={redo} disabled={!canRedo}>
          <Redo2 className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button variant="ghost" size="sm" onClick={togglePalette}>
          Palette
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleInspector}>
          Inspector
        </Button>
      </div>

      {/* Right: theme + export + save */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-muted border border-border"
          role="switch"
          aria-checked={theme === "dark"}
        >
          <span
            className={`inline-flex h-4 w-4 items-center justify-center rounded-full bg-background shadow transition-transform ${
              theme === "dark" ? "translate-x-5.5" : "translate-x-0.5"
            }`}
          >
            {theme === "dark" ? <Moon className="w-2.5 h-2.5 text-foreground" /> : <Sun className="w-2.5 h-2.5 text-foreground" />}
          </span>
        </button>
        <div className="w-px h-5 bg-border" />
        <Button variant="ghost" size="sm" onClick={handleExport} disabled={!diagram}>
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </Button>
        <Button size="sm" onClick={handleSave} disabled={!isDirty || isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
