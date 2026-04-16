"use client";

import { Button } from "@/components/ui/button";

interface UnsavedChangesDialogProps {
  onSaveAndLeave: () => void;
  onLeaveWithoutSaving: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function UnsavedChangesDialog({
  onSaveAndLeave,
  onLeaveWithoutSaving,
  onCancel,
  isSaving,
}: UnsavedChangesDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div className="relative bg-background border border-border rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-base font-semibold mb-2">Unsaved changes</h2>
        <p className="text-sm text-muted-foreground mb-5">
          You have unsaved changes. Do you want to save before leaving?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLeaveWithoutSaving}
            disabled={isSaving}
            className="text-destructive hover:text-destructive"
          >
            Discard
          </Button>
          <Button size="sm" onClick={onSaveAndLeave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save & leave"}
          </Button>
        </div>
      </div>
    </div>
  );
}
