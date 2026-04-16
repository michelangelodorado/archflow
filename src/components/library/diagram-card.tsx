"use client";

import { DiagramSummary } from "@/lib/types/canonical";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DiagramPreview } from "./diagram-preview";
import { ExternalLink, Copy, Download, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DiagramCardProps {
  diagram: DiagramSummary;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
}

export function DiagramCard({ diagram, onDuplicate, onDelete, onExport }: DiagramCardProps) {
  const router = useRouter();

  return (
    <Card className="flex flex-col" onClick={() => router.push(`/diagram/${diagram.id}`)}>
      {/* Thumbnail */}
      <div className="h-36 bg-muted rounded-t-lg flex items-center justify-center border-b border-border p-3">
        <DiagramPreview diagramId={diagram.id} />
      </div>

      <CardHeader>
        <h3 className="font-semibold text-sm truncate">{diagram.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{diagram.description}</p>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-1">
          {diagram.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">
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
      </CardFooter>
    </Card>
  );
}
