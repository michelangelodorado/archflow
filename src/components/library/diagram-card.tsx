"use client";

import { DiagramSummary } from "@/lib/types/canonical";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface DiagramCardProps {
  diagram: DiagramSummary;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DiagramCard({ diagram, onDuplicate, onDelete }: DiagramCardProps) {
  const router = useRouter();

  return (
    <Card className="flex flex-col" onClick={() => router.push(`/diagram/${diagram.id}`)}>
      {/* Thumbnail placeholder */}
      <div className="h-36 bg-muted rounded-t-lg flex items-center justify-center border-b border-border">
        <svg className="w-12 h-12 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
        </svg>
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
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => router.push(`/diagram/${diagram.id}`)}>
            Open
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDuplicate(diagram.id)}>
            Duplicate
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(diagram.id)}>
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
