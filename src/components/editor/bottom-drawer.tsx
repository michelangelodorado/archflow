"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/lib/store/editor-store";
import { generateDiagram } from "@/lib/services/ai-service";
import { canonicalToFlow } from "@/lib/converters/canonical-to-flow";
import { getDiagramVersions } from "@/lib/services/diagram-service";

type Tab = "ai" | "json" | "validation" | "history";

const tabs: { id: Tab; label: string }[] = [
  { id: "ai", label: "AI Prompt" },
  { id: "json", label: "JSON View" },
  { id: "validation", label: "Validation" },
  { id: "history", label: "History" },
];

export function BottomDrawer() {
  const {
    isBottomDrawerOpen,
    bottomDrawerTab,
    setBottomDrawerTab,
    toggleBottomDrawer,
    diagram,
    diagramId,
    loadDiagram,
  } = useEditorStore();

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const handleAiSubmit = async () => {
    if (!aiPrompt.trim() || !diagram) return;
    setAiLoading(true);
    setAiMessage("");

    // TODO: Replace mock with real LLM call
    const result = await generateDiagram({
      prompt: aiPrompt,
      existingDiagram: diagram,
    });

    if (diagramId) {
      loadDiagram(diagramId, result.diagram);
    }
    setAiMessage(result.message);
    setAiLoading(false);
    setAiPrompt("");
  };

  const validationErrors = diagram ? validateDiagram(diagram) : [];
  const versions = diagramId ? getDiagramVersions(diagramId) : [];

  return (
    <div className={`border-t border-border bg-background transition-all shrink-0
      ${isBottomDrawerOpen ? "h-64" : "h-9"}`}
    >
      {/* Tab bar */}
      <div className="h-9 flex items-center border-b border-border px-2 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setBottomDrawerTab(tab.id)}
            className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors
              ${bottomDrawerTab === tab.id && isBottomDrawerOpen
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab.label}
            {tab.id === "validation" && validationErrors.length > 0 && (
              <span className="ml-1 text-destructive">({validationErrors.length})</span>
            )}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={toggleBottomDrawer}
          className="p-1 text-muted-foreground hover:text-foreground"
        >
          <svg className={`w-3.5 h-3.5 transition-transform ${isBottomDrawerOpen ? "" : "rotate-180"}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {isBottomDrawerOpen && (
        <div className="h-[calc(100%-2.25rem)] overflow-y-auto p-3">
          {bottomDrawerTab === "ai" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Describe changes you want to make to the diagram. The AI will update the canonical model.
              </p>
              <div className="flex gap-2">
                <Input
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAiSubmit()}
                  placeholder="e.g. Add a Redis cache between the API gateway and the user service"
                  disabled={aiLoading}
                />
                <Button size="sm" onClick={handleAiSubmit} disabled={aiLoading || !aiPrompt.trim()}>
                  {aiLoading ? "Generating..." : "Send"}
                </Button>
              </div>
              {aiMessage && (
                <div className="text-xs bg-muted p-2 rounded-md text-muted-foreground">
                  {aiMessage}
                </div>
              )}
            </div>
          )}

          {bottomDrawerTab === "json" && (
            <pre className="text-xs font-mono bg-muted p-3 rounded-md overflow-auto max-h-44">
              {diagram ? JSON.stringify(diagram, null, 2) : "No diagram loaded"}
            </pre>
          )}

          {bottomDrawerTab === "validation" && (
            <div className="space-y-1">
              {validationErrors.length === 0 ? (
                <p className="text-xs text-green-600">No validation issues found.</p>
              ) : (
                validationErrors.map((err, i) => (
                  <div key={i} className="text-xs flex items-start gap-2 p-1.5 bg-destructive/5 rounded">
                    <span className="text-destructive">!</span>
                    <span>{err}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {bottomDrawerTab === "history" && (
            <div className="space-y-1">
              {versions.length === 0 ? (
                <p className="text-xs text-muted-foreground">No version history.</p>
              ) : (
                versions.map((v) => (
                  <div key={v.id} className="text-xs flex items-center gap-3 p-1.5 rounded hover:bg-muted">
                    <span className="font-mono text-muted-foreground">v{v.version}</span>
                    <span className="flex-1">{v.message}</span>
                    <span className="text-muted-foreground">
                      {new Date(v.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Basic validation
function validateDiagram(diagram: { entities: { id: string }[]; relationships: { from: string; to: string }[] }): string[] {
  const errors: string[] = [];
  const entityIds = new Set(diagram.entities.map((e) => e.id));

  for (const rel of diagram.relationships) {
    if (!entityIds.has(rel.from)) {
      errors.push(`Relationship references unknown source entity: ${rel.from}`);
    }
    if (!entityIds.has(rel.to)) {
      errors.push(`Relationship references unknown target entity: ${rel.to}`);
    }
  }

  const duplicateIds = diagram.entities
    .map((e) => e.id)
    .filter((id, i, arr) => arr.indexOf(id) !== i);
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate entity IDs: ${duplicateIds.join(", ")}`);
  }

  return errors;
}
