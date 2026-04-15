"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "@/lib/services/diagram-service";

export default function DiagramsPage() {
  const router = useRouter();
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
          <Button onClick={() => router.push("/diagram/new")}>
            + New Diagram
          </Button>
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
