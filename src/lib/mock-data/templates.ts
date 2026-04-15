import { CanonicalDiagram } from "@/lib/types/canonical";

export const blankDiagram: CanonicalDiagram = {
  version: "1.0",
  diagramType: "architecture",
  title: "Untitled Diagram",
  description: "",
  entities: [],
  relationships: [],
  layout: { positions: [] },
  style: { entities: [], relationships: [] },
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
  },
};

export const microservicesTemplate: CanonicalDiagram = {
  version: "1.0",
  diagramType: "architecture",
  title: "Microservices Template",
  description: "A basic microservices architecture with API gateway, services, and data stores.",
  entities: [
    { id: "client", kind: "client", label: "Web Client", properties: { technology: "React" } },
    { id: "gateway", kind: "gateway", label: "API Gateway", properties: { technology: "Kong", port: 443 } },
    { id: "auth-svc", kind: "service", label: "Auth Service", properties: { technology: "Node.js", port: 3001 } },
    { id: "user-svc", kind: "service", label: "User Service", properties: { technology: "Go", port: 3002 } },
    { id: "order-svc", kind: "service", label: "Order Service", properties: { technology: "Python", port: 3003 } },
    { id: "auth-db", kind: "database", label: "Auth DB", properties: { technology: "PostgreSQL" } },
    { id: "user-db", kind: "database", label: "User DB", properties: { technology: "PostgreSQL" } },
    { id: "order-db", kind: "database", label: "Order DB", properties: { technology: "MongoDB" } },
    { id: "msg-queue", kind: "queue", label: "Message Queue", properties: { technology: "RabbitMQ" } },
    { id: "cache", kind: "cache", label: "Cache", properties: { technology: "Redis" } },
  ],
  relationships: [
    { id: "r1", from: "client", to: "gateway", kind: "sync", label: "HTTPS", traffic: { protocol: "http", direction: "bidirectional", label: "REST API", animated: true } },
    { id: "r2", from: "gateway", to: "auth-svc", kind: "sync", label: "Auth", traffic: { protocol: "http", direction: "bidirectional", label: "JWT validation", animated: true } },
    { id: "r3", from: "gateway", to: "user-svc", kind: "sync", label: "Users", traffic: { protocol: "grpc", direction: "bidirectional", label: "gRPC", animated: true } },
    { id: "r4", from: "gateway", to: "order-svc", kind: "sync", label: "Orders", traffic: { protocol: "http", direction: "bidirectional", label: "REST", animated: true } },
    { id: "r5", from: "auth-svc", to: "auth-db", kind: "data-flow", label: "Query", traffic: { protocol: "tcp", direction: "bidirectional", label: "SQL", animated: false } },
    { id: "r6", from: "user-svc", to: "user-db", kind: "data-flow", label: "Query", traffic: { protocol: "tcp", direction: "bidirectional", label: "SQL", animated: false } },
    { id: "r7", from: "order-svc", to: "order-db", kind: "data-flow", label: "Query", traffic: { protocol: "tcp", direction: "bidirectional", label: "MongoDB Wire", animated: false } },
    { id: "r8", from: "order-svc", to: "msg-queue", kind: "async", label: "Publish", traffic: { protocol: "amqp", direction: "unidirectional", label: "Order Events", animated: true } },
    { id: "r9", from: "user-svc", to: "msg-queue", kind: "async", label: "Subscribe", traffic: { protocol: "amqp", direction: "unidirectional", label: "User Events", animated: true } },
    { id: "r10", from: "gateway", to: "cache", kind: "sync", label: "Cache", traffic: { protocol: "tcp", direction: "bidirectional", label: "Session Cache", animated: false } },
  ],
  layout: {
    positions: [
      { entityId: "client", position: { x: 400, y: 0 } },
      { entityId: "gateway", position: { x: 400, y: 150 } },
      { entityId: "cache", position: { x: 700, y: 150 } },
      { entityId: "auth-svc", position: { x: 100, y: 350 } },
      { entityId: "user-svc", position: { x: 400, y: 350 } },
      { entityId: "order-svc", position: { x: 700, y: 350 } },
      { entityId: "auth-db", position: { x: 100, y: 550 } },
      { entityId: "user-db", position: { x: 400, y: 550 } },
      { entityId: "order-db", position: { x: 700, y: 550 } },
      { entityId: "msg-queue", position: { x: 550, y: 500 } },
    ],
  },
  style: { entities: [], relationships: [] },
  metadata: {
    createdAt: "2026-04-10T10:00:00Z",
    updatedAt: "2026-04-10T10:00:00Z",
    tags: ["microservices", "template"],
  },
};

export const eventDrivenTemplate: CanonicalDiagram = {
  version: "1.0",
  diagramType: "data-flow",
  title: "Event-Driven Template",
  description: "An event-driven architecture with producers, event bus, and consumers.",
  entities: [
    { id: "producer-1", kind: "service", label: "Order Producer", properties: { technology: "Java" } },
    { id: "producer-2", kind: "service", label: "Payment Producer", properties: { technology: "Go" } },
    { id: "event-bus", kind: "queue", label: "Event Bus", properties: { technology: "Apache Kafka" } },
    { id: "consumer-1", kind: "service", label: "Notification Consumer", properties: { technology: "Node.js" } },
    { id: "consumer-2", kind: "service", label: "Analytics Consumer", properties: { technology: "Python" } },
    { id: "consumer-3", kind: "function", label: "Audit Logger", properties: { technology: "AWS Lambda" } },
    { id: "analytics-db", kind: "database", label: "Analytics Store", properties: { technology: "ClickHouse" } },
    { id: "storage", kind: "storage", label: "Audit Logs", properties: { technology: "S3" } },
  ],
  relationships: [
    { id: "r1", from: "producer-1", to: "event-bus", kind: "event", label: "Order Events", traffic: { protocol: "kafka", direction: "unidirectional", label: "Order Events", animated: true } },
    { id: "r2", from: "producer-2", to: "event-bus", kind: "event", label: "Payment Events", traffic: { protocol: "kafka", direction: "unidirectional", label: "Payment Events", animated: true } },
    { id: "r3", from: "event-bus", to: "consumer-1", kind: "event", label: "Notifications", traffic: { protocol: "kafka", direction: "unidirectional", label: "Consume", animated: true } },
    { id: "r4", from: "event-bus", to: "consumer-2", kind: "event", label: "Analytics", traffic: { protocol: "kafka", direction: "unidirectional", label: "Consume", animated: true } },
    { id: "r5", from: "event-bus", to: "consumer-3", kind: "event", label: "Audit", traffic: { protocol: "kafka", direction: "unidirectional", label: "Consume", animated: true } },
    { id: "r6", from: "consumer-2", to: "analytics-db", kind: "data-flow", label: "Write", traffic: { protocol: "tcp", direction: "unidirectional", label: "Insert", animated: false } },
    { id: "r7", from: "consumer-3", to: "storage", kind: "data-flow", label: "Store", traffic: { protocol: "http", direction: "unidirectional", label: "Put Object", animated: false } },
  ],
  layout: {
    positions: [
      { entityId: "producer-1", position: { x: 100, y: 100 } },
      { entityId: "producer-2", position: { x: 100, y: 300 } },
      { entityId: "event-bus", position: { x: 400, y: 200 } },
      { entityId: "consumer-1", position: { x: 700, y: 50 } },
      { entityId: "consumer-2", position: { x: 700, y: 200 } },
      { entityId: "consumer-3", position: { x: 700, y: 350 } },
      { entityId: "analytics-db", position: { x: 950, y: 200 } },
      { entityId: "storage", position: { x: 950, y: 350 } },
    ],
  },
  style: { entities: [], relationships: [] },
  metadata: {
    createdAt: "2026-04-12T14:00:00Z",
    updatedAt: "2026-04-12T14:00:00Z",
    tags: ["event-driven", "kafka", "template"],
  },
};

export const templates = [
  { id: "microservices", name: "Microservices", description: "API gateway, services, and data stores", diagram: microservicesTemplate },
  { id: "event-driven", name: "Event-Driven", description: "Producers, event bus, and consumers", diagram: eventDrivenTemplate },
];
