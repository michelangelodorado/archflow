// ---------------------------------------------------------------------------
// Mock Diagram Service
// TODO: Replace mock in-memory store with Prisma queries against Postgres.
// ---------------------------------------------------------------------------

import { v4 as uuid } from "uuid";
import {
  CanonicalDiagram,
  DiagramSummary,
  DiagramVersionSummary,
} from "@/lib/types/canonical";
import { seedDiagramSummaries, seedDiagramDocuments } from "@/lib/mock-data/seed";
import { blankDiagram } from "@/lib/mock-data/templates";

// In-memory mock store (replaced by DB in production)
let summaries: DiagramSummary[] = [...seedDiagramSummaries];
let documents: Record<string, CanonicalDiagram> = { ...seedDiagramDocuments };
let versions: Record<string, DiagramVersionSummary[]> = {};

// Initialize version history for seed data
for (const id of Object.keys(documents)) {
  versions[id] = [
    {
      id: uuid(),
      version: 1,
      message: "Initial version",
      createdAt: documents[id].metadata.createdAt,
    },
  ];
}

// ---- List -----------------------------------------------------------------

export function listDiagrams(): DiagramSummary[] {
  return summaries;
}

// ---- Get ------------------------------------------------------------------

export function getDiagram(id: string): CanonicalDiagram | null {
  return documents[id] ?? null;
}

export function getDiagramSummary(id: string): DiagramSummary | null {
  return summaries.find((s) => s.id === id) ?? null;
}

// ---- Create ---------------------------------------------------------------

export function createDiagram(
  diagram: CanonicalDiagram,
): { summary: DiagramSummary; document: CanonicalDiagram } {
  const id = uuid();
  const now = new Date().toISOString();

  const doc: CanonicalDiagram = {
    ...diagram,
    metadata: { ...diagram.metadata, createdAt: now, updatedAt: now },
  };

  const summary: DiagramSummary = {
    id,
    title: doc.title,
    description: doc.description,
    thumbnailUrl: null,
    tags: doc.metadata.tags,
    createdAt: now,
    updatedAt: now,
  };

  summaries = [summary, ...summaries];
  documents[id] = doc;
  versions[id] = [
    { id: uuid(), version: 1, message: "Initial version", createdAt: now },
  ];

  return { summary, document: doc };
}

// ---- Update ---------------------------------------------------------------

export function updateDiagram(
  id: string,
  diagram: CanonicalDiagram,
  message = "Updated",
): CanonicalDiagram | null {
  if (!documents[id]) return null;
  const now = new Date().toISOString();

  const doc: CanonicalDiagram = {
    ...diagram,
    metadata: { ...diagram.metadata, updatedAt: now },
  };

  documents[id] = doc;

  const idx = summaries.findIndex((s) => s.id === id);
  if (idx !== -1) {
    summaries[idx] = {
      ...summaries[idx],
      title: doc.title,
      description: doc.description,
      tags: doc.metadata.tags,
      updatedAt: now,
    };
  }

  const versionList = versions[id] ?? [];
  const nextVersion = versionList.length + 1;
  versionList.push({
    id: uuid(),
    version: nextVersion,
    message,
    createdAt: now,
  });
  versions[id] = versionList;

  return doc;
}

// ---- Duplicate ------------------------------------------------------------

export function duplicateDiagram(id: string): DiagramSummary | null {
  const doc = documents[id];
  if (!doc) return null;
  const result = createDiagram({
    ...doc,
    title: `${doc.title} (Copy)`,
  });
  return result.summary;
}

// ---- Delete ---------------------------------------------------------------

export function deleteDiagram(id: string): boolean {
  if (!documents[id]) return false;
  summaries = summaries.filter((s) => s.id !== id);
  delete documents[id];
  delete versions[id];
  return true;
}

// ---- Versions -------------------------------------------------------------

export function getDiagramVersions(id: string): DiagramVersionSummary[] {
  return versions[id] ?? [];
}

// ---- Create blank ---------------------------------------------------------

export function createBlankDiagram(): { summary: DiagramSummary; document: CanonicalDiagram } {
  return createDiagram({ ...blankDiagram });
}

// ---- Export ---------------------------------------------------------------

export function exportDiagramToFile(id: string): void {
  const doc = documents[id];
  if (!doc) return;

  const json = JSON.stringify(doc, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const slug = doc.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const filename = `${slug || "diagram"}.archflow.json`;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCanonicalToFile(diagram: CanonicalDiagram): void {
  const json = JSON.stringify(diagram, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const slug = diagram.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const filename = `${slug || "diagram"}.archflow.json`;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---- Import ---------------------------------------------------------------

function validateCanonicalDiagram(data: unknown): data is CanonicalDiagram {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    d.version === "1.0" &&
    typeof d.title === "string" &&
    typeof d.description === "string" &&
    Array.isArray(d.entities) &&
    Array.isArray(d.relationships) &&
    typeof d.layout === "object" &&
    d.layout !== null
  );
}

export function importDiagramFromJson(
  json: string,
): { summary: DiagramSummary; document: CanonicalDiagram } | { error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { error: "Invalid JSON file." };
  }

  if (!validateCanonicalDiagram(parsed)) {
    return {
      error: "The file is not a valid ArchFlow diagram. Expected version \"1.0\" with title, entities, relationships, and layout.",
    };
  }

  return createDiagram(parsed);
}
