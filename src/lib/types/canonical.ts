// ---------------------------------------------------------------------------
// Canonical Diagram Schema
// This is the single source of truth. React Flow JSON is derived from this.
// ---------------------------------------------------------------------------

export type DiagramType =
  | "architecture"
  | "network"
  | "data-flow"
  | "sequence"
  | "custom";

export type EntityKind =
  | "service"
  | "database"
  | "queue"
  | "cache"
  | "load-balancer"
  | "cdn"
  | "storage"
  | "client"
  | "function"
  | "gateway"
  | "cloud"
  | "security"
  | "group"
  | "generic";

export type RelationshipKind =
  | "sync"
  | "async"
  | "event"
  | "data-flow"
  | "dependency";

export type TrafficProtocol =
  | "http"
  | "grpc"
  | "websocket"
  | "tcp"
  | "amqp"
  | "kafka"
  | "custom";

export type TrafficDirection = "unidirectional" | "bidirectional";

// ---- Entity ---------------------------------------------------------------

export interface EntityProperties {
  technology?: string;
  description?: string;
  port?: number;
  url?: string;
  [key: string]: unknown;
}

export interface Entity {
  id: string;
  kind: EntityKind;
  label: string;
  properties: EntityProperties;
}

// ---- Relationship ---------------------------------------------------------

export interface TrafficConfig {
  protocol: TrafficProtocol;
  direction: TrafficDirection;
  label: string;
  animated: boolean;
  bandwidth?: string; // e.g. "100 req/s"
}

export interface Relationship {
  id: string;
  from: string; // entity id
  to: string; // entity id
  kind: RelationshipKind;
  label: string;
  traffic: TrafficConfig;
}

// ---- Layout ---------------------------------------------------------------

export interface Position {
  x: number;
  y: number;
}

export interface EntityLayout {
  entityId: string;
  position: Position;
  width?: number;
  height?: number;
}

export interface Layout {
  positions: EntityLayout[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}

// ---- Style ----------------------------------------------------------------

export interface EntityStyle {
  entityId: string;
  color?: string;
  icon?: string;
  opacity?: number;
}

export interface RelationshipStyle {
  relationshipId: string;
  color?: string;
  strokeWidth?: number;
  dashArray?: string;
}

export interface Style {
  entities: EntityStyle[];
  relationships: RelationshipStyle[];
  theme?: "light" | "dark" | "system";
}

// ---- Metadata -------------------------------------------------------------

export interface DiagramMetadata {
  author?: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  tags: string[];
  notes?: string;
}

// ---- Root Document --------------------------------------------------------

export interface CanonicalDiagram {
  version: "1.0";
  diagramType: DiagramType;
  title: string;
  description: string;
  entities: Entity[];
  relationships: Relationship[];
  layout: Layout;
  style: Style;
  metadata: DiagramMetadata;
}

// ---- Library types (lightweight, for list views) --------------------------

export interface DiagramSummary {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ---- Version history ------------------------------------------------------

export interface DiagramVersionSummary {
  id: string;
  version: number;
  message: string;
  createdAt: string;
}
