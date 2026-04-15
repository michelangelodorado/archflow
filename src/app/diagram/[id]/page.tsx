"use client";

import { useEffect, use } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import { getDiagram } from "@/lib/services/diagram-service";
import { EditorLayout } from "@/components/editor/editor-layout";

export default function DiagramEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { loadDiagram, diagram } = useEditorStore();

  useEffect(() => {
    // TODO: Replace with API fetch from Postgres
    const doc = getDiagram(id);
    if (doc) {
      loadDiagram(id, doc);
    }
  }, [id, loadDiagram]);

  if (!diagram) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading diagram...</p>
      </div>
    );
  }

  return <EditorLayout />;
}
