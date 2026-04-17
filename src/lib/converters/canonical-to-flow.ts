// ---------------------------------------------------------------------------
// Converts canonical diagram model <-> React Flow nodes/edges
// ---------------------------------------------------------------------------

import type { Node, Edge } from "@xyflow/react";
import type {
  CanonicalDiagram,
  Entity,
  EntityLayout,
  Relationship,
  Position,
} from "@/lib/types/canonical";

// ---- Canonical → React Flow -----------------------------------------------

export function canonicalToNodes(diagram: CanonicalDiagram): Node[] {
  const posMap = new Map<string, Position>();
  const dimMap = new Map<string, { width?: number; height?: number }>();
  for (const p of diagram.layout.positions) {
    posMap.set(p.entityId, p.position);
    if (p.width || p.height) {
      dimMap.set(p.entityId, { width: p.width, height: p.height });
    }
  }

  // Build nodes — groups first so React Flow renders them behind children
  const groups: Node[] = [];
  const others: Node[] = [];

  // Keys that are part of the canonical entity structure (not extra UI data)
  const canonicalKeys = new Set(["technology", "description", "port", "url", "parentId"]);

  for (const entity of diagram.entities) {
    const isGroup = entity.kind === "group";
    const dims = dimMap.get(entity.id);
    const parentId = entity.properties.parentId as string | undefined;

    // Separate canonical properties from extra UI-level data (dualSides, icon, borderColor, etc.)
    const extraData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(entity.properties)) {
      if (!canonicalKeys.has(key) && value !== undefined) {
        extraData[key] = value;
      }
    }

    // Restore dimensions — groups always get style (with defaults), other nodes only if resized
    const nodeStyle: Record<string, unknown> = {};
    if (isGroup) {
      nodeStyle.width = dims?.width ?? 400;
      nodeStyle.height = dims?.height ?? 300;
    } else if (dims?.width || dims?.height) {
      if (dims.width) nodeStyle.width = dims.width;
      if (dims.height) nodeStyle.height = dims.height;
    }

    // Set explicit width/height so React Flow has dimensions before DOM measurement.
    // Without these, getNodeDimensions() returns 0 during adoptUserNodes(),
    // causing clampPositionToParent() to clamp children to the parent's top-left.
    const nodeWidth = isGroup ? (dims?.width ?? 400) : dims?.width;
    const nodeHeight = isGroup ? (dims?.height ?? 300) : dims?.height;

    const node: Node = {
      id: entity.id,
      type: entityKindToNodeType(entity.kind),
      position: posMap.get(entity.id) ?? { x: 0, y: 0 },
      data: {
        label: entity.label,
        kind: entity.kind,
        properties: entity.properties,
        ...extraData,
      },
      ...(Object.keys(nodeStyle).length > 0 && { style: nodeStyle }),
      ...(nodeWidth != null && { width: nodeWidth }),
      ...(nodeHeight != null && { height: nodeHeight }),
      ...(isGroup && { zIndex: -1 }),
      ...(parentId && {
        parentId,
        extent: "parent" as const,
        expandParent: true,
      }),
    };

    if (isGroup) {
      groups.push(node);
    } else {
      others.push(node);
    }
  }

  return [...groups, ...others];
}

export function canonicalToEdges(diagram: CanonicalDiagram): Edge[] {
  return diagram.relationships.map((rel) => {
    const extra = (rel as unknown as Record<string, unknown>);
    const edgeType = (extra.edgeType as string) ?? "animated";
    const traffic = rel.traffic ?? {
      protocol: "http" as const,
      direction: "unidirectional" as const,
      label: "",
      animated: false,
    };
    const displayLabel = traffic.label || rel.label || "";
    return {
      id: rel.id,
      source: rel.from,
      target: rel.to,
      sourceHandle: (extra.sourceHandle as string) ?? "bottom",
      targetHandle: (extra.targetHandle as string) ?? "top",
      type: edgeType,
      animated: edgeType === "tunnel" ? false : traffic.animated,
      label: displayLabel,
      data: {
        kind: rel.kind,
        traffic,
        label: displayLabel,
        pathType: extra.pathType ?? undefined,
        arrowEnd: extra.arrowEnd ?? undefined,
      },
    };
  });
}

export function canonicalToFlow(diagram: CanonicalDiagram) {
  return {
    nodes: canonicalToNodes(diagram),
    edges: canonicalToEdges(diagram),
    viewport: diagram.layout.viewport ?? { x: 0, y: 0, zoom: 1 },
  };
}

// ---- React Flow → Canonical (write-back positions) ------------------------

export function flowNodesToLayout(nodes: Node[]): EntityLayout[] {
  return nodes.map((node) => {
    const style = node.style as Record<string, unknown> | undefined;
    return {
      entityId: node.id,
      position: { x: node.position.x, y: node.position.y },
      width: node.measured?.width ?? node.width ?? (style?.width as number | undefined) ?? undefined,
      height: node.measured?.height ?? node.height ?? (style?.height as number | undefined) ?? undefined,
    };
  });
}

export function flowToCanonical(
  nodes: Node[],
  edges: Edge[],
  base: CanonicalDiagram,
): CanonicalDiagram {
  const entities: Entity[] = nodes.map((node) => {
    const d = node.data as Record<string, unknown>;
    const existingProps = ((d.properties ?? {}) as Entity["properties"]);
    const props: Entity["properties"] = { ...existingProps };

    // Persist parentId into properties for canonical round-trip
    if (node.parentId) {
      props.parentId = node.parentId;
    } else {
      delete props.parentId;
    }

    // Persist extra UI-level data (dualSides, icon, borderColor, etc.) into properties
    const skipKeys = new Set(["kind", "label", "properties"]);
    for (const [key, value] of Object.entries(d)) {
      if (!skipKeys.has(key) && value !== undefined) {
        props[key] = value;
      }
    }

    return {
      id: node.id,
      kind: d.kind as Entity["kind"],
      label: d.label as string,
      properties: props,
    };
  });

  const relationships: Relationship[] = edges.map((edge) => {
    const d = edge.data as { kind?: string; label?: string; traffic?: Relationship["traffic"]; pathType?: string; arrowEnd?: string } | undefined;
    const edgeLabel = (edge.label as string) || d?.label || "";
    const traffic: Relationship["traffic"] = d?.traffic
      ? { ...d.traffic, label: edgeLabel || d.traffic.label, animated: edge.animated ?? d.traffic.animated }
      : {
          protocol: "http" as const,
          direction: "unidirectional" as const,
          label: edgeLabel,
          animated: edge.animated ?? false,
        };
    return {
      id: edge.id,
      from: edge.source,
      to: edge.target,
      kind: (d?.kind ?? "sync") as Relationship["kind"],
      label: edgeLabel,
      traffic,
      // Persist handle connections and edge display settings
      sourceHandle: edge.sourceHandle ?? "bottom",
      targetHandle: edge.targetHandle ?? "top",
      pathType: d?.pathType,
      arrowEnd: d?.arrowEnd,
      edgeType: edge.type ?? "animated",
    } as Relationship & { sourceHandle: string; targetHandle: string; pathType?: string; arrowEnd?: string; edgeType?: string };
  });

  return {
    ...base,
    entities,
    relationships,
    layout: {
      ...base.layout,
      positions: flowNodesToLayout(nodes),
    },
    metadata: {
      ...base.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}

// ---- Helpers --------------------------------------------------------------

function entityKindToNodeType(kind: string): string {
  const supported = [
    "service", "database", "queue", "cache",
    "load-balancer", "cdn", "cloud", "security", "storage", "client", "function", "gateway", "group",
    "server", "application", "api", "text", "callout", "icon", "generic",
  ];
  return supported.includes(kind) ? kind : "generic";
}
