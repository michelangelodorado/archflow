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
  Image,
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
  { kind: "group", label: "Group", lightColor: "border-gray-400 bg-gray-100", darkColor: "border-gray-600 bg-gray-900", icon: Layers, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "service", label: "Service", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: Box, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "database", label: "Database", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: Database, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "queue", label: "Queue", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: ListOrdered, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "cache", label: "Cache", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: Zap, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "gateway", label: "Gateway", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: Network, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "load-balancer", label: "Load Balancer", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: Scale, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "cloud", label: "Cloud", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: Cloud, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "security", label: "Security", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: Shield, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "cdn", label: "CDN", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: Globe, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "storage", label: "Storage", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: HardDrive, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "client", label: "Client", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: Monitor, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "server", label: "Server", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: Server, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "application", label: "Application", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: AppWindow, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "api", label: "API", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: Webhook, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "function", label: "Function", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: SquareFunction, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "text", label: "Text", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: Type, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "callout", label: "Callout", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: MessageSquareQuote, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
  { kind: "icon", label: "Icon", lightColor: "border-gray-300 bg-gray-50", darkColor: "border-gray-600 bg-gray-900", icon: Image, lightIconColor: "text-gray-500", darkIconColor: "text-gray-400" },
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
