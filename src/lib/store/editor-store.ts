import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";
import type { CanonicalDiagram } from "@/lib/types/canonical";
import { canonicalToFlow, flowToCanonical } from "@/lib/converters/canonical-to-flow";

const MAX_HISTORY = 50;

interface HistoryEntry {
  nodes: Node[];
  edges: Edge[];
}

interface EditorState {
  // Source of truth
  diagram: CanonicalDiagram | null;
  diagramId: string | null;

  // React Flow projection (derived from canonical)
  nodes: Node[];
  edges: Edge[];

  // History (undo/redo)
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  canUndo: boolean;
  canRedo: boolean;

  // Clipboard
  clipboard: Node[] | null;

  // UI state
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isPaletteOpen: boolean;
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

  // History actions
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Clipboard actions
  copySelectedNodes: () => void;
  pasteNodes: () => void;
  duplicateSelectedNodes: () => void;
  selectAllNodes: () => void;
  deleteSelected: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  diagram: null,
  diagramId: null,
  nodes: [],
  edges: [],
  undoStack: [],
  redoStack: [],
  canUndo: false,
  canRedo: false,
  clipboard: null,
  selectedNodeId: null,
  selectedEdgeId: null,
  isPaletteOpen: true,
  isInspectorOpen: true,
  bottomDrawerTab: "ai",
  isBottomDrawerOpen: false,
  isSaving: false,
  isDirty: false,

  loadDiagram: (id, diagram) => {
    const { nodes, edges } = canonicalToFlow(diagram);
    set({ diagram, diagramId: id, nodes, edges, isDirty: false, undoStack: [], redoStack: [], canUndo: false, canRedo: false });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

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

  togglePalette: () => set((s) => ({ isPaletteOpen: !s.isPaletteOpen })),
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

  // --- History (undo / redo) ------------------------------------------------

  pushHistory: () => {
    const { nodes, edges, undoStack } = get();
    const entry: HistoryEntry = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    const newStack = [...undoStack, entry].slice(-MAX_HISTORY);
    set({ undoStack: newStack, redoStack: [], canUndo: true, canRedo: false });
  },

  undo: () => {
    const { undoStack, redoStack, nodes, edges } = get();
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    const newUndo = undoStack.slice(0, -1);
    const currentEntry: HistoryEntry = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    set({
      nodes: prev.nodes,
      edges: prev.edges,
      undoStack: newUndo,
      redoStack: [...redoStack, currentEntry],
      canUndo: newUndo.length > 0,
      canRedo: true,
      isDirty: true,
    });
  },

  redo: () => {
    const { undoStack, redoStack, nodes, edges } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const newRedo = redoStack.slice(0, -1);
    const currentEntry: HistoryEntry = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    set({
      nodes: next.nodes,
      edges: next.edges,
      undoStack: [...undoStack, currentEntry],
      redoStack: newRedo,
      canUndo: true,
      canRedo: newRedo.length > 0,
      isDirty: true,
    });
  },

  // --- Clipboard (copy / paste / duplicate) ---------------------------------

  copySelectedNodes: () => {
    const { nodes, selectedNodeId } = get();
    if (!selectedNodeId) return;
    const selected = nodes.filter((n) => n.id === selectedNodeId || n.selected);
    if (selected.length === 0) return;
    set({ clipboard: JSON.parse(JSON.stringify(selected)) });
  },

  pasteNodes: () => {
    const { clipboard, nodes } = get();
    if (!clipboard || clipboard.length === 0) return;
    get().pushHistory();
    const offset = 40;
    const now = Date.now();
    const newNodes = clipboard.map((n, i) => ({
      ...n,
      id: `node-${now}-${i}`,
      position: { x: n.position.x + offset, y: n.position.y + offset },
      selected: false,
    }));
    set({ nodes: [...nodes, ...newNodes], isDirty: true });
  },

  duplicateSelectedNodes: () => {
    const { nodes, selectedNodeId } = get();
    if (!selectedNodeId) return;
    const selected = nodes.filter((n) => n.id === selectedNodeId || n.selected);
    if (selected.length === 0) return;
    get().pushHistory();
    const offset = 40;
    const now = Date.now();
    const newNodes = selected.map((n, i) => ({
      ...JSON.parse(JSON.stringify(n)),
      id: `node-${now}-${i}`,
      position: { x: n.position.x + offset, y: n.position.y + offset },
      selected: false,
    }));
    set({ nodes: [...nodes, ...newNodes], isDirty: true });
  },

  selectAllNodes: () => {
    set((state) => ({
      nodes: state.nodes.map((n) => ({ ...n, selected: true })),
    }));
  },

  deleteSelected: () => {
    const { nodes, edges, selectedNodeId, selectedEdgeId } = get();
    const selectedNodeIds = new Set(
      nodes.filter((n) => n.id === selectedNodeId || n.selected).map((n) => n.id),
    );
    if (selectedNodeIds.size === 0 && !selectedEdgeId) return;
    get().pushHistory();
    set({
      nodes: nodes.filter((n) => !selectedNodeIds.has(n.id)),
      edges: edges.filter(
        (e) =>
          e.id !== selectedEdgeId &&
          !selectedNodeIds.has(e.source) &&
          !selectedNodeIds.has(e.target),
      ),
      selectedNodeId: null,
      selectedEdgeId: null,
      isDirty: true,
    });
  },
}));
