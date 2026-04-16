"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiagramCard } from "@/components/library/diagram-card";
import { DiagramListItem } from "@/components/library/diagram-list-item";
import { LibraryToolbar } from "@/components/library/library-toolbar";
import { EmptyState } from "@/components/library/empty-state";
import { useLibraryStore } from "@/lib/store/library-store";
import {
  listDiagrams,
  deleteDiagram,
  duplicateDiagram,
  exportDiagramToFile,
  importDiagramFromJson,
} from "@/lib/services/diagram-service";

export default function DiagramsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    diagrams,
    setDiagrams,
    viewMode,
    filteredDiagrams,
    removeDiagram,
    addDiagram,
  } = useLibraryStore();

  useEffect(() => {
    // TODO: Replace with API fetch from Postgres
    setDiagrams(listDiagrams());
  }, [setDiagrams]);

  const handleDelete = (id: string) => {
    deleteDiagram(id);
    removeDiagram(id);
  };

  const handleDuplicate = (id: string) => {
    const result = duplicateDiagram(id);
    if (result) {
      addDiagram(result);
    }
  };

  const handleExport = (id: string) => {
    exportDiagramToFile(id);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const json = reader.result as string;
      const result = importDiagramFromJson(json);
      if ("error" in result) {
        alert(result.error);
      } else {
        addDiagram(result.summary);
        router.push(`/diagram/${result.summary.id}`);
      }
    };
    reader.readAsText(file);

    // Reset so the same file can be re-imported
    e.target.value = "";
  };

  const filtered = filteredDiagrams();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">ArchFlow</h1>
            <p className="text-sm text-muted-foreground">Architecture Diagrams</p>
          </div>
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
            <Button variant="outline" onClick={handleImport}>
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import
            </Button>
            <Button onClick={() => router.push("/diagram/new")}>
              + New Diagram
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.archflow.json"
            className="hidden"
            onChange={handleFileSelected}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {diagrams.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <LibraryToolbar />

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No diagrams match your filters.</p>
                <button
                  onClick={() => useLibraryStore.getState().clearFilters()}
                  className="text-sm text-primary mt-2 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {filtered.map((d) => (
                  <DiagramCard
                    key={d.id}
                    diagram={d}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                    onExport={handleExport}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2 mt-4">
                {filtered.map((d) => (
                  <DiagramListItem
                    key={d.id}
                    diagram={d}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                    onExport={handleExport}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
