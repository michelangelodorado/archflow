"use client";

import { DiagramSummary } from "@/lib/types/canonical";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DiagramPreview } from "./diagram-preview";
import { ExternalLink, Copy, Download, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DiagramListItemProps {
  diagram: DiagramSummary;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
}

export function DiagramListItem({ diagram, onDuplicate, onDelete, onExport }: DiagramListItemProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/diagram/${diagram.id}`)}
      className="flex items-center gap-4 p-3 rounded-lg border border-border bg-background hover:shadow-sm transition-shadow cursor-pointer"
    >
      {/* Mini thumbnail */}
      <div className="w-16 h-16 rounded bg-muted flex-shrink-0 flex items-center justify-center p-1.5">
        <DiagramPreview diagramId={diagram.id} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{diagram.title}</h3>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{diagram.description}</p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {diagram.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </div>

      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {new Date(diagram.updatedAt).toLocaleDateString()}
      </span>

      <div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-7 w-7" title="Open" onClick={() => router.push(`/diagram/${diagram.id}`)}>
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" title="Duplicate" onClick={() => onDuplicate(diagram.id)}>
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" title="Export" onClick={() => onExport(diagram.id)}>
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title="Delete" onClick={() => onDelete(diagram.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
