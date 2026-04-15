"use client";

import type { EntityKind } from "@/lib/types/canonical";

interface PaletteItem {
  kind: EntityKind;
  label: string;
  color: string;
}

const paletteItems: PaletteItem[] = [
  { kind: "group", label: "Group", color: "border-indigo-300 bg-indigo-50" },
  { kind: "service", label: "Service", color: "border-blue-300 bg-blue-50" },
  { kind: "database", label: "Database", color: "border-green-300 bg-green-50" },
  { kind: "queue", label: "Queue", color: "border-orange-300 bg-orange-50" },
  { kind: "cache", label: "Cache", color: "border-purple-300 bg-purple-50" },
  { kind: "gateway", label: "Gateway", color: "border-blue-300 bg-blue-50" },
  { kind: "load-balancer", label: "Load Balancer", color: "border-gray-300 bg-gray-50" },
  { kind: "cloud", label: "Cloud", color: "border-sky-300 bg-sky-50" },
  { kind: "security", label: "Security", color: "border-red-300 bg-red-50" },
  { kind: "cdn", label: "CDN", color: "border-gray-300 bg-gray-50" },
  { kind: "storage", label: "Storage", color: "border-gray-300 bg-gray-50" },
  { kind: "client", label: "Client", color: "border-gray-300 bg-gray-50" },
  { kind: "function", label: "Function", color: "border-blue-300 bg-blue-50" },
  { kind: "generic", label: "Generic", color: "border-gray-300 bg-gray-50" },
];

export function ComponentPalette() {
  const onDragStart = (event: React.DragEvent, kind: string) => {
    event.dataTransfer.setData("application/archflow-kind", kind);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-52 border-r border-border bg-background overflow-y-auto shrink-0">
      <div className="p-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Components
        </h2>
        <div className="space-y-1.5">
          {paletteItems.map((item) => (
            <div
              key={item.kind}
              draggable
              onDragStart={(e) => onDragStart(e, item.kind)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-grab active:cursor-grabbing
                hover:shadow-sm transition-shadow text-sm ${item.color}`}
            >
              <span className="w-3 h-3 rounded-sm border border-current opacity-60" />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
