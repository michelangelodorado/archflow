"use client";

import { DiagramSummary } from "@/lib/types/canonical";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface DiagramListItemProps {
  diagram: DiagramSummary;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DiagramListItem({ diagram, onDuplicate, onDelete }: DiagramListItemProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/diagram/${diagram.id}`)}
      className="flex items-center gap-4 p-3 rounded-lg border border-border bg-background hover:shadow-sm transition-shadow cursor-pointer"
    >
      {/* Mini thumbnail */}
      <div className="w-16 h-16 rounded bg-muted flex-shrink-0 flex items-center justify-center">
        <svg className="w-6 h-6 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
        </svg>
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

      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm" onClick={() => router.push(`/diagram/${diagram.id}`)}>Open</Button>
        <Button variant="ghost" size="sm" onClick={() => onDuplicate(diagram.id)}>Duplicate</Button>
        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(diagram.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
