"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Panel,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  type Connection,
  type OnConnect,
  type OnNodeDrag,
  type NodeChange,
  type EdgeChange,
  BackgroundVariant,
} from "@xyflow/react";
import { nodeTypes, edgeTypes } from "@/components/flow/node-types";
import { useEditorStore } from "@/lib/store/editor-store";
import { useKeyboardShortcuts } from "@/lib/hooks/use-keyboard-shortcuts";
import { FlowPanel } from "./flow-panel";
import { useEffect } from "react";

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}

function CanvasInner() {
  useKeyboardShortcuts();

  const { screenToFlowPosition } = useReactFlow();
  const {
    nodes: storeNodes,
    edges: storeEdges,
    setNodes,
    setEdges,
    setDirty,
    selectNode,
    selectEdge,
    pushHistory,
    setViewport,
    viewport: storeViewport,
    flows,
    activeFlowId,
  } = useEditorStore();

  const hasSavedViewport = storeViewport.x !== 0 || storeViewport.y !== 0 || storeViewport.zoom !== 1;

  const [nodes, setLocalNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState(storeEdges);

  // Sync from store when diagram loads
  useEffect(() => {
    setLocalNodes(storeNodes);
    setLocalEdges(storeEdges);
  }, [storeNodes, storeEdges, setLocalNodes, setLocalEdges]);

  // Sync back to store on changes
  useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

  const activeFlow = useMemo(
    () => flows.find((f) => f.id === activeFlowId) ?? null,
    [flows, activeFlowId],
  );

  const displayNodes = useMemo(() => {
    if (!activeFlow) return nodes;
    const hlSet = new Set(activeFlow.nodeIds);
    const color = activeFlow.color ?? "#3b82f6";
    return nodes.map((n) => {
      const isGroup = (n.data as Record<string, unknown>).kind === "group";
      if (hlSet.has(n.id)) {
        return isGroup
          ? { ...n, data: { ...n.data, highlightColor: color }, style: { ...n.style, opacity: 1, filter: "none", transition: "opacity 0.3s ease, filter 0.3s ease" } }
          : { ...n, style: { ...n.style, opacity: 1, filter: `drop-shadow(0 0 6px ${color}80)`, transition: "opacity 0.3s ease, filter 0.3s ease" } };
      }
      return { ...n, data: { ...n.data, highlightColor: undefined }, style: { ...n.style, opacity: 0.15, filter: "none", transition: "opacity 0.3s ease, filter 0.3s ease" } };
    });
  }, [nodes, activeFlow]);

  const displayEdges = useMemo(() => {
    if (!activeFlow) return edges;
    const nodeSet = new Set(activeFlow.nodeIds);
    const color = activeFlow.color ?? "#3b82f6";
    return edges.map((e) => {
      const isHL = nodeSet.has(e.source) && nodeSet.has(e.target);
      return {
        ...e,
        data: { ...e.data, dimmed: !isHL, highlighted: isHL, highlightColor: isHL ? color : undefined },
      };
    });
  }, [edges, activeFlow]);

  const editingFlowId = useEditorStore((s) => s.editingFlowId);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const filtered = editingFlowId
        ? changes.filter((c) => c.type !== "select")
        : changes;
      if (filtered.length > 0) onNodesChange(filtered);
      if (filtered.some((c) => c.type !== "select" && c.type !== "dimensions")) {
        setDirty(true);
      }
    },
    [onNodesChange, setDirty, editingFlowId],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      if (changes.some((c) => c.type !== "select")) {
        setDirty(true);
      }
    },
    [onEdgesChange, setDirty],
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      pushHistory();
      setLocalEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "animated",
            animated: true,
            data: {
              kind: "sync",
              label: "",
              traffic: {
                protocol: "http",
                direction: "unidirectional",
                label: "",
                animated: true,
              },
            },
          },
          eds,
        ),
      );
      setDirty(true);
    },
    [setLocalEdges, setDirty, pushHistory],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      if (editingFlowId) {
        setLocalNodes((nds) =>
          nds.map((n) => (n.id === node.id ? { ...n, selected: !n.selected } : n)),
        );
        return;
      }
      selectNode(node.id);
    },
    [selectNode, editingFlowId, setLocalNodes],
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: { id: string }) => {
      selectEdge(edge.id);
    },
    [selectEdge],
  );

  const onNodeDragStart: OnNodeDrag = useCallback(() => {
    pushHistory();
  }, [pushHistory]);

  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const kind = event.dataTransfer.getData("application/archflow-kind");
      if (!kind) return;

      const GRID = 20;
      const flowPos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const position = {
        x: Math.round(flowPos.x / GRID) * GRID,
        y: Math.round(flowPos.y / GRID) * GRID,
      };

      const kindToType: Record<string, string> = {
        service: "service",
        database: "database",
        queue: "queue",
        cache: "cache",
        gateway: "gateway",
        function: "function",
        client: "client",
        "load-balancer": "load-balancer",
        cloud: "cloud",
        security: "security",
        server: "server",
        application: "application",
        api: "api",
        cdn: "cdn",
        storage: "storage",
        text: "text",
        callout: "callout",
        group: "group",
        generic: "generic",
      };

      pushHistory();
      const isGroup = kind === "group";
      const isText = kind === "text";
      const isCallout = kind === "callout";
      const defaultLabel = isGroup
        ? "New Group"
        : isText
          ? "Double-click to edit"
          : isCallout
            ? "Callout"
            : kind.charAt(0).toUpperCase() + kind.slice(1);
      const newNode = {
        id: `node-${Date.now()}`,
        type: kindToType[kind] || "generic",
        position,
        ...(isGroup && { style: { width: 400, height: 300 }, zIndex: -1 }),
        data: {
          label: defaultLabel,
          kind,
          properties: {},
        },
      };

      setLocalNodes((nds) => [...nds, newNode]);
      setDirty(true);
    },
    [setLocalNodes, setDirty, pushHistory, screenToFlowPosition],
  );

  const onMoveEnd = useCallback(
    (_: unknown, viewport: { x: number; y: number; zoom: number }) => {
      setViewport(viewport);
    },
    [setViewport],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={onNodeDragStart}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onMoveEnd={onMoveEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        snapToGrid
        snapGrid={[20, 20]}
        {...(hasSavedViewport
          ? { defaultViewport: storeViewport }
          : { fitView: true, fitViewOptions: { padding: 0.3, maxZoom: 0.85 } })}
        deleteKeyCode={null}
        className="!bg-canvas"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="!fill-canvas-dot" />
        <Controls position="bottom-left" />
        <Panel position="top-right">
          <FlowPanel />
        </Panel>
        <MiniMap
          position="bottom-right"
          nodeColor={(node) => {
            if (node.type === "text") return "transparent";
            const data = node.data as Record<string, unknown>;
            if (node.type === "callout") return (data.borderColor as string) ?? "#9ca3af";
            if (node.type === "group") return (data.borderColor as string) ?? "#9ca3af";
            return (data.nodeColor as string) ?? "#9ca3af";
          }}
        />
      </ReactFlow>
    </div>
  );
}
