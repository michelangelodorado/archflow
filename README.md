# ArchFlow

Interactive logical architecture diagram editor with animated traffic flow.

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** with strict mode
- **React Flow** (`@xyflow/react`) for the diagram canvas
- **Zustand** for client-side state management
- **Tailwind CSS v4** for styling
- **Prisma** for ORM (Postgres, schema ready but using mock data)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll be redirected to the diagram library.

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Redirects to /diagrams
│   ├── diagrams/page.tsx         # Diagram library (grid/list, search, filter)
│   ├── diagram/new/page.tsx      # Create new diagram (blank/template/AI)
│   └── diagram/[id]/page.tsx     # Diagram editor
│
├── components/
│   ├── ui/                       # Shared primitives (Button, Card, Input, Badge)
│   ├── library/                  # Library page components
│   │   ├── diagram-card.tsx      # Grid view card
│   │   ├── diagram-list-item.tsx # List view row
│   │   ├── library-toolbar.tsx   # Search, sort, filter, view toggle
│   │   └── empty-state.tsx       # Empty library state
│   ├── editor/                   # Editor page components
│   │   ├── editor-layout.tsx     # Full editor shell
│   │   ├── toolbar.tsx           # Top toolbar (save, back, toggle panels)
│   │   ├── component-palette.tsx # Left panel (drag-and-drop node palette)
│   │   ├── canvas.tsx            # React Flow canvas wrapper
│   │   ├── inspector-panel.tsx   # Right panel (node/edge properties)
│   │   └── bottom-drawer.tsx     # Bottom panel (AI, JSON, validation, history)
│   └── flow/                     # React Flow custom types
│       ├── node-types.ts         # Node/edge type registry
│       ├── custom-nodes/         # Service, Database, Queue, Cache, Generic
│       └── custom-edges/         # Animated traffic edge
│
├── lib/
│   ├── types/canonical.ts        # Canonical diagram schema (source of truth)
│   ├── store/
│   │   ├── editor-store.ts       # Zustand store for editor state
│   │   └── library-store.ts      # Zustand store for library state
│   ├── services/
│   │   ├── diagram-service.ts    # Mock CRUD service (replace with Prisma)
│   │   └── ai-service.ts         # Mock AI generation (replace with LLM)
│   ├── converters/
│   │   └── canonical-to-flow.ts  # Canonical JSON <-> React Flow conversion
│   ├── mock-data/
│   │   ├── seed.ts               # Sample diagrams
│   │   └── templates.ts          # Starter templates
│   └── prisma.ts                 # Prisma client singleton (commented out)
│
└── prisma/
    └── schema.prisma             # Diagram + DiagramVersion models
```

## Architecture Decisions

### Canonical Model as Source of Truth

The system uses a semantic JSON schema (`CanonicalDiagram`) as the single source of truth for every diagram. This schema separates:

- **Entities** — what components exist (services, databases, queues, etc.)
- **Relationships** — how they connect, including traffic configuration
- **Layout** — positional data (x/y coordinates)
- **Style** — visual overrides (colors, stroke width)
- **Metadata** — author, timestamps, tags

React Flow's nodes/edges are a *projection* derived from this model via `canonical-to-flow.ts`. Changes in the canvas are written back to the canonical model before persistence.

### Mock Data Layer

All CRUD operations currently use an in-memory store in `diagram-service.ts`. The Prisma schema is ready — once a Postgres database is connected, replace the service functions with Prisma queries. Look for `TODO` comments marking integration points.

### AI Integration

The bottom drawer has an AI prompt panel that calls `ai-service.ts`. Currently returns a mock response. The interface is designed so the LLM receives `{ prompt, existingDiagram }` and returns updated canonical JSON. Replace `generateDiagram()` with a real API call.

## Key Routes

| Route | Purpose |
|---|---|
| `/diagrams` | Diagram library with grid/list views, search, sort, filter |
| `/diagram/new` | Create new diagram (blank, template, or AI-generated) |
| `/diagram/[id]` | Full diagram editor with canvas, palette, inspector, bottom drawer |

## Next Steps (TODOs)

1. **Database persistence** — Configure `DATABASE_URL`, run `npx prisma migrate dev`, uncomment `prisma.ts`, replace mock service with Prisma queries
2. **Real AI integration** — Replace `ai-service.ts` mock with actual LLM API call (send canonical JSON + prompt, receive updated JSON)
3. **Thumbnail generation** — Render diagram to image for library card previews
4. **Undo/redo** — Add history stack to the editor store
5. **Export** — PNG, SVG, and JSON export from the editor
6. **Authentication** — Add user auth when moving to multi-tenant
7. **Real-time collaboration** — WebSocket-based multiplayer editing
8. **API routes** — Add `/api/diagrams` route handlers for server-side operations
