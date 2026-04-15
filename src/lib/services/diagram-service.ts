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
