import { DiagramSummary, CanonicalDiagram } from "@/lib/types/canonical";
import { microservicesTemplate, eventDrivenTemplate } from "./templates";

// -- Seed diagram summaries for the library view ----------------------------

export const seedDiagramSummaries: DiagramSummary[] = [
  {
    id: "d-1",
    title: "E-Commerce Platform",
    description: "Production architecture for our e-commerce platform with microservices.",
    thumbnailUrl: null,
    tags: ["production", "microservices", "e-commerce"],
    createdAt: "2026-03-15T09:00:00Z",
    updatedAt: "2026-04-14T16:30:00Z",
  },
  {
    id: "d-2",
    title: "Data Pipeline",
    description: "Real-time event streaming pipeline for analytics ingestion.",
    thumbnailUrl: null,
    tags: ["data", "kafka", "analytics"],
    createdAt: "2026-04-01T11:00:00Z",
    updatedAt: "2026-04-13T10:00:00Z",
  },
  {
    id: "d-3",
    title: "Auth System",
    description: "Authentication and authorization service architecture.",
    thumbnailUrl: null,
    tags: ["auth", "security"],
    createdAt: "2026-04-05T08:00:00Z",
    updatedAt: "2026-04-12T14:00:00Z",
  },
  {
    id: "d-4",
    title: "CI/CD Pipeline",
    description: "Build, test, and deployment pipeline architecture.",
    thumbnailUrl: null,
    tags: ["devops", "ci-cd"],
    createdAt: "2026-04-10T13:00:00Z",
    updatedAt: "2026-04-11T09:00:00Z",
  },
];

// -- Full canonical documents keyed by diagram id ---------------------------

export const seedDiagramDocuments: Record<string, CanonicalDiagram> = {
  "d-1": {
    ...microservicesTemplate,
    title: "E-Commerce Platform",
    description: "Production architecture for our e-commerce platform with microservices.",
    metadata: {
      ...microservicesTemplate.metadata,
      tags: ["production", "microservices", "e-commerce"],
    },
  },
  "d-2": {
    ...eventDrivenTemplate,
    title: "Data Pipeline",
    description: "Real-time event streaming pipeline for analytics ingestion.",
    metadata: {
      ...eventDrivenTemplate.metadata,
      tags: ["data", "kafka", "analytics"],
    },
  },
  "d-3": {
    ...microservicesTemplate,
    title: "Auth System",
    description: "Authentication and authorization service architecture.",
    entities: microservicesTemplate.entities.slice(0, 5),
    relationships: microservicesTemplate.relationships.slice(0, 4),
    layout: {
      positions: microservicesTemplate.layout.positions.slice(0, 5),
    },
    metadata: {
      ...microservicesTemplate.metadata,
      tags: ["auth", "security"],
    },
  },
  "d-4": {
    ...eventDrivenTemplate,
    title: "CI/CD Pipeline",
    description: "Build, test, and deployment pipeline architecture.",
    metadata: {
      ...eventDrivenTemplate.metadata,
      tags: ["devops", "ci-cd"],
    },
  },
};
