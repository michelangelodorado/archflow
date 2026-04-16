"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
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
  } = useEditorStore();

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

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      if (changes.some((c) => c.type !== "select" && c.type !== "dimensions")) {
        setDirty(true);
      }
    },
    [onNodesChange, setDirty],
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
      selectNode(node.id);
    },
    [selectNode],
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
        group: "group",
        generic: "generic",
      };

      pushHistory();
      const isGroup = kind === "group";
      const isText = kind === "text";
      const defaultLabel = isGroup
        ? "New Group"
        : isText
          ? "Double-click to edit"
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

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={onNodeDragStart}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        snapToGrid
        snapGrid={[20, 20]}
        fitView
        deleteKeyCode={null}
        className="!bg-canvas"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="!fill-canvas-dot" />
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          nodeColor={(node) => {
            switch (node.type) {
              case "service": return "#3b82f6";
              case "database": return "#22c55e";
              case "queue": return "#f97316";
              case "cache": return "#a855f7";
              case "load-balancer": return "#f59e0b";
              case "cdn": return "#0ea5e9";
              case "storage": return "#14b8a6";
              case "client": return "#6366f1";
              case "function": return "#f43f5e";
              case "gateway": return "#06b6d4";
              case "cloud": return "#38bdf8";
              case "security": return "#f87171";
              case "server": return "#64748b";
              case "application": return "#8b5cf6";
              case "api": return "#f59e0b";
              case "text": return "transparent";
              case "group": return "#818cf8";
              default: return "#94a3b8";
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}
