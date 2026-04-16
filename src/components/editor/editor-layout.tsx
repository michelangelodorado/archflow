"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { Toolbar } from "./toolbar";
import { ComponentPalette } from "./component-palette";
import { Canvas } from "./canvas";
import { InspectorPanel } from "./inspector-panel";
import { BottomDrawer } from "./bottom-drawer";

export function EditorLayout() {
  const { isPaletteOpen, isInspectorOpen } = useEditorStore();

  return (
    <div className="h-screen flex flex-col">
      <Toolbar />
      <div className="flex flex-1 min-h-0">
        {isPaletteOpen && <ComponentPalette />}
        <Canvas />
        {isInspectorOpen && <InspectorPanel />}
      </div>
      <BottomDrawer />
    </div>
  );
}
