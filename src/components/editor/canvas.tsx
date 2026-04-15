"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type OnConnect,
  type OnNodeDrag,
  BackgroundVariant,
} from "@xyflow/react";
import { nodeTypes, edgeTypes } from "@/components/flow/node-types";
import { useEditorStore } from "@/lib/store/editor-store";
import { useEffect } from "react";

export function Canvas() {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    setNodes,
    setEdges,
    selectNode,
    selectEdge,
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

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
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
    },
    [setLocalEdges],
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

  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const kind = event.dataTransfer.getData("application/archflow-kind");
      if (!kind) return;

      const bounds = (event.target as HTMLElement).closest(".react-flow")?.getBoundingClientRect();
      if (!bounds) return;

      const GRID = 20;
      const position = {
        x: Math.round((event.clientX - bounds.left) / GRID) * GRID,
        y: Math.round((event.clientY - bounds.top) / GRID) * GRID,
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
        cdn: "cdn",
        storage: "storage",
        group: "group",
        generic: "generic",
      };

      const isGroup = kind === "group";
      const newNode = {
        id: `node-${Date.now()}`,
        type: kindToType[kind] || "generic",
        position,
        ...(isGroup && { style: { width: 400, height: 300 }, zIndex: -1 }),
        data: {
          label: isGroup ? "New Group" : kind.charAt(0).toUpperCase() + kind.slice(1),
          kind,
          properties: {},
        },
      };

      setLocalNodes((nds) => [...nds, newNode]);
    },
    [setLocalNodes],
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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
        deleteKeyCode="Delete"
        className="bg-gray-50"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
        <Controls position="bottom-right" />
        <MiniMap
          position="bottom-right"
          className="!mb-14"
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
              case "group": return "#818cf8";
              default: return "#94a3b8";
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}
