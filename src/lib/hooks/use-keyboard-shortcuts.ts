"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/lib/store/editor-store";

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Don't intercept when typing in inputs/textareas
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl+Z — undo
      if (ctrl && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        useEditorStore.getState().undo();
        return;
      }

      // Ctrl+Shift+Z or Ctrl+Y — redo
      if ((ctrl && e.shiftKey && e.key === "z") || (ctrl && e.key === "y")) {
        e.preventDefault();
        useEditorStore.getState().redo();
        return;
      }

      // Ctrl+C — copy
      if (ctrl && e.key === "c") {
        e.preventDefault();
        useEditorStore.getState().copySelectedNodes();
        return;
      }

      // Ctrl+V — paste
      if (ctrl && e.key === "v") {
        e.preventDefault();
        useEditorStore.getState().pasteNodes();
        return;
      }

      // Ctrl+D — duplicate
      if (ctrl && e.key === "d") {
        e.preventDefault();
        useEditorStore.getState().duplicateSelectedNodes();
        return;
      }

      // Ctrl+A — select all
      if (ctrl && e.key === "a") {
        e.preventDefault();
        useEditorStore.getState().selectAllNodes();
        return;
      }

      // Delete / Backspace — delete selected
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        useEditorStore.getState().deleteSelected();
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
