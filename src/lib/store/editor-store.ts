import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";
import type { CanonicalDiagram } from "@/lib/types/canonical";
import { canonicalToFlow, flowToCanonical } from "@/lib/converters/canonical-to-flow";

interface EditorState {
  // Source of truth
  diagram: CanonicalDiagram | null;
  diagramId: string | null;

  // React Flow projection (derived from canonical)
  nodes: Node[];
  edges: Edge[];

  // UI state
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isPalettOpen: boolean;
  isInspectorOpen: boolean;
  bottomDrawerTab: "ai" | "json" | "validation" | "history";
  isBottomDrawerOpen: boolean;
  isSaving: boolean;
  isDirty: boolean;

  // Actions
  loadDiagram: (id: string, diagram: CanonicalDiagram) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: Node[]) => void;
  onEdgesChange: (changes: Edge[]) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  addNode: (node: Node) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  updateEdgeLabel: (id: string, label: string) => void;
  updateEdgeAnimated: (id: string, animated: boolean) => void;
  updateEdgePathType: (id: string, pathType: string) => void;
  updateEdgeArrow: (id: string, arrowEnd: string) => void;
  setNodeParent: (nodeId: string, parentId: string | null) => void;
  syncToCanonical: () => void;
  togglePalette: () => void;
  toggleInspector: () => void;
  setBottomDrawerTab: (tab: EditorState["bottomDrawerTab"]) => void;
  toggleBottomDrawer: () => void;
  setSaving: (saving: boolean) => void;
  setDirty: (dirty: boolean) => void;
  updateDiagramMeta: (title: string, description: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  diagram: null,
  diagramId: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  isPalettOpen: true,
  isInspectorOpen: true,
  bottomDrawerTab: "ai",
  isBottomDrawerOpen: false,
  isSaving: false,
  isDirty: false,

  loadDiagram: (id, diagram) => {
    const { nodes, edges } = canonicalToFlow(diagram);
    set({ diagram, diagramId: id, nodes, edges, isDirty: false });
  },

  setNodes: (nodes) => set({ nodes, isDirty: true }),
  setEdges: (edges) => set({ edges, isDirty: true }),

  onNodesChange: (nodes) => set({ nodes, isDirty: true }),
  onEdgesChange: (edges) => set({ edges, isDirty: true }),

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node], isDirty: true })),

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
      isDirty: true,
    })),

  removeEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
      selectedEdgeId: state.selectedEdgeId === id ? null : state.selectedEdgeId,
      isDirty: true,
    })),

  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n,
      ),
      isDirty: true,
    })),

  updateEdgeLabel: (id, label) =>
    set((state) => ({
      edges: state.edges.map((e) =>
        e.id === id
          ? {
              ...e,
              label,
              data: {
                ...((e.data as Record<string, unknown>) ?? {}),
                label,
              },
            }
          : e,
      ),
      isDirty: true,
    })),

  updateEdgeAnimated: (id, animated) =>
    set((state) => ({
      edges: state.edges.map((e) =>
        e.id === id
          ? {
              ...e,
              animated,
              data: {
                ...((e.data as Record<string, unknown>) ?? {}),
                traffic: {
                  ...(((e.data as Record<string, unknown>)?.traffic as Record<string, unknown>) ?? {}),
                  animated,
                },
              },
            }
          : e,
      ),
      isDirty: true,
    })),

  updateEdgePathType: (id, pathType) =>
    set((state) => ({
      edges: state.edges.map((e) =>
        e.id === id
          ? {
              ...e,
              data: {
                ...((e.data as Record<string, unknown>) ?? {}),
                pathType,
              },
            }
          : e,
      ),
      isDirty: true,
    })),

  updateEdgeArrow: (id, arrowEnd) =>
    set((state) => ({
      edges: state.edges.map((e) =>
        e.id === id
          ? {
              ...e,
              data: {
                ...((e.data as Record<string, unknown>) ?? {}),
                arrowEnd,
              },
            }
          : e,
      ),
      isDirty: true,
    })),

  setNodeParent: (nodeId, parentId) =>
    set((state) => {
      const parent = parentId ? state.nodes.find((n) => n.id === parentId) : null;
      const child = state.nodes.find((n) => n.id === nodeId);
      if (!child) return {};

      // Convert absolute position to relative (offset from parent top-left)
      let relativePos = child.position;
      if (parent) {
        relativePos = {
          x: child.position.x - parent.position.x,
          y: child.position.y - parent.position.y,
        };
        // Clamp so the child starts inside the parent
        relativePos.x = Math.max(20, relativePos.x);
        relativePos.y = Math.max(30, relativePos.y);
      }

      // If removing from a parent, convert back to absolute
      if (!parentId && child.parentId) {
        const oldParent = state.nodes.find((n) => n.id === child.parentId);
        if (oldParent) {
          relativePos = {
            x: child.position.x + oldParent.position.x,
            y: child.position.y + oldParent.position.y,
          };
        }
      }

      const updatedNodes = state.nodes.map((n) => {
        if (n.id !== nodeId) return n;
        const updated = { ...n, position: relativePos };
        if (parentId) {
          updated.parentId = parentId;
          updated.extent = "parent" as const;
          updated.expandParent = true;
        } else {
          delete updated.parentId;
          delete updated.extent;
          delete updated.expandParent;
        }
        return updated;
      });

      return { nodes: updatedNodes, isDirty: true };
    }),

  syncToCanonical: () => {
    const { nodes, edges, diagram } = get();
    if (!diagram) return;
    const updated = flowToCanonical(nodes, edges, diagram);
    set({ diagram: updated });
  },

  togglePalette: () => set((s) => ({ isPalettOpen: !s.isPalettOpen })),
  toggleInspector: () => set((s) => ({ isInspectorOpen: !s.isInspectorOpen })),
  setBottomDrawerTab: (tab) => set({ bottomDrawerTab: tab, isBottomDrawerOpen: true }),
  toggleBottomDrawer: () => set((s) => ({ isBottomDrawerOpen: !s.isBottomDrawerOpen })),
  setSaving: (saving) => set({ isSaving: saving }),
  setDirty: (dirty) => set({ isDirty: dirty }),

  updateDiagramMeta: (title, description) =>
    set((state) => {
      if (!state.diagram) return {};
      return {
        diagram: { ...state.diagram, title, description },
        isDirty: true,
      };
    }),
}));
