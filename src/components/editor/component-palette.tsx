"use client";

import { useState, useMemo } from "react";
import { useTheme } from "@/components/theme-provider";
import type { EntityKind } from "@/lib/types/canonical";
import type { LucideIcon } from "lucide-react";
import {
  Layers,
  Box,
  Database,
  ListOrdered,
  Zap,
  Network,
  Scale,
  Cloud,
  Shield,
  Globe,
  HardDrive,
  Monitor,
  SquareFunction,
  LayoutGrid,
  Server,
  AppWindow,
  Webhook,
  Type,
  MessageSquareQuote,
  Search,
} from "lucide-react";

interface PaletteItem {
  kind: EntityKind;
  label: string;
  lightColor: string;
  darkColor: string;
  icon: LucideIcon;
  lightIconColor: string;
  darkIconColor: string;
}

const paletteItems: PaletteItem[] = [
  { kind: "group", label: "Group", lightColor: "border-indigo-300 bg-indigo-50", darkColor: "border-indigo-700 bg-indigo-950", icon: Layers, lightIconColor: "text-indigo-500", darkIconColor: "text-indigo-400" },
  { kind: "service", label: "Service", lightColor: "border-blue-300 bg-blue-50", darkColor: "border-blue-700 bg-blue-950", icon: Box, lightIconColor: "text-blue-500", darkIconColor: "text-blue-400" },
  { kind: "database", label: "Database", lightColor: "border-green-300 bg-green-50", darkColor: "border-green-700 bg-green-950", icon: Database, lightIconColor: "text-green-500", darkIconColor: "text-green-400" },
  { kind: "queue", label: "Queue", lightColor: "border-orange-300 bg-orange-50", darkColor: "border-orange-700 bg-orange-950", icon: ListOrdered, lightIconColor: "text-orange-500", darkIconColor: "text-orange-400" },
  { kind: "cache", label: "Cache", lightColor: "border-purple-300 bg-purple-50", darkColor: "border-purple-700 bg-purple-950", icon: Zap, lightIconColor: "text-purple-500", darkIconColor: "text-purple-400" },
  { kind: "gateway", label: "Gateway", lightColor: "border-blue-300 bg-blue-50", darkColor: "border-blue-700 bg-blue-950", icon: Network, lightIconColor: "text-blue-500", darkIconColor: "text-blue-400" },
  { kind: "load-balancer", label: "Load Balancer", lightColor: "border-yellow-300 bg-yellow-50", darkColor: "border-yellow-700 bg-yellow-950", icon: Scale, lightIconColor: "text-yellow-500", darkIconColor: "text-yellow-400" },
  { kind: "cloud", label: "Cloud", lightColor: "border-sky-300 bg-sky-50", darkColor: "border-sky-700 bg-sky-950", icon: Cloud, lightIconColor: "text-sky-500", darkIconColor: "text-sky-400" },
  { kind: "security", label: "Security", lightColor: "border-red-300 bg-red-50", darkColor: "border-red-700 bg-red-950", icon: Shield, lightIconColor: "text-red-500", darkIconColor: "text-red-400" },
  { kind: "cdn", label: "CDN", lightColor: "border-cyan-300 bg-cyan-50", darkColor: "border-cyan-700 bg-cyan-950", icon: Globe, lightIconColor: "text-cyan-500", darkIconColor: "text-cyan-400" },
  { kind: "storage", label: "Storage", lightColor: "border-teal-300 bg-teal-50", darkColor: "border-teal-700 bg-teal-950", icon: HardDrive, lightIconColor: "text-teal-500", darkIconColor: "text-teal-400" },
  { kind: "client", label: "Client", lightColor: "border-indigo-300 bg-indigo-50", darkColor: "border-indigo-700 bg-indigo-950", icon: Monitor, lightIconColor: "text-indigo-500", darkIconColor: "text-indigo-400" },
  { kind: "server", label: "Server", lightColor: "border-slate-300 bg-slate-50", darkColor: "border-slate-600 bg-slate-900", icon: Server, lightIconColor: "text-slate-500", darkIconColor: "text-slate-400" },
  { kind: "application", label: "Application", lightColor: "border-violet-300 bg-violet-50", darkColor: "border-violet-700 bg-violet-950", icon: AppWindow, lightIconColor: "text-violet-500", darkIconColor: "text-violet-400" },
  { kind: "api", label: "API", lightColor: "border-amber-300 bg-amber-50", darkColor: "border-amber-700 bg-amber-950", icon: Webhook, lightIconColor: "text-amber-500", darkIconColor: "text-amber-400" },
  { kind: "function", label: "Function", lightColor: "border-blue-300 bg-blue-50", darkColor: "border-blue-700 bg-blue-950", icon: SquareFunction, lightIconColor: "text-blue-500", darkIconColor: "text-blue-400" },
  { kind: "text", label: "Text", lightColor: "border-stone-300 bg-stone-50", darkColor: "border-stone-600 bg-stone-900", icon: Type, lightIconColor: "text-stone-500", darkIconColor: "text-stone-400" },
  { kind: "callout", label: "Callout", lightColor: "border-yellow-300 bg-yellow-50", darkColor: "border-yellow-700 bg-yellow-950", icon: MessageSquareQuote, lightIconColor: "text-yellow-500", darkIconColor: "text-yellow-400" },
  { kind: "generic", label: "Generic", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: LayoutGrid, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
];

export function ComponentPalette() {
  const [search, setSearch] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const filtered = useMemo(() => {
    if (!search.trim()) return paletteItems;
    const q = search.toLowerCase();
    return paletteItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [search]);

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
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter..."
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-1.5">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.kind}
                draggable
                onDragStart={(e) => onDragStart(e, item.kind)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-grab active:cursor-grabbing
                  hover:shadow-sm transition-shadow text-sm text-foreground ${isDark ? item.darkColor : item.lightColor}`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isDark ? item.darkIconColor : item.lightIconColor}`} />
                {item.label}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No matches</p>
          )}
        </div>
      </div>
    </div>
  );
}
