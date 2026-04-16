import { ServiceNode } from "./custom-nodes/service-node";
import { DatabaseNode } from "./custom-nodes/database-node";
import { QueueNode } from "./custom-nodes/queue-node";
import { CacheNode } from "./custom-nodes/cache-node";
import { GenericNode } from "./custom-nodes/generic-node";
import { LoadBalancerNode } from "./custom-nodes/load-balancer-node";
import { CdnNode } from "./custom-nodes/cdn-node";
import { StorageNode } from "./custom-nodes/storage-node";
import { ClientNode } from "./custom-nodes/client-node";
import { FunctionNode } from "./custom-nodes/function-node";
import { GatewayNode } from "./custom-nodes/gateway-node";
import { CloudNode } from "./custom-nodes/cloud-node";
import { SecurityNode } from "./custom-nodes/security-node";
import { ServerNode } from "./custom-nodes/server-node";
import { ApplicationNode } from "./custom-nodes/application-node";
import { ApiNode } from "./custom-nodes/api-node";
import { TextNode } from "./custom-nodes/text-node";
import { GroupNode } from "./custom-nodes/group-node";
import { AnimatedEdge } from "./custom-edges/animated-edge";
import type { NodeTypes, EdgeTypes } from "@xyflow/react";

export const nodeTypes: NodeTypes = {
  service: ServiceNode,
  database: DatabaseNode,
  queue: QueueNode,
  cache: CacheNode,
  generic: GenericNode,
  "load-balancer": LoadBalancerNode,
  cdn: CdnNode,
  storage: StorageNode,
  client: ClientNode,
  function: FunctionNode,
  gateway: GatewayNode,
  cloud: CloudNode,
  security: SecurityNode,
  server: ServerNode,
  application: ApplicationNode,
  api: ApiNode,
  text: TextNode,
  group: GroupNode,
};

export const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
};
