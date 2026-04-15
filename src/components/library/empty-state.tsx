"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function EmptyState() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg className="w-20 h-20 text-muted-foreground/30 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
      <h2 className="text-xl font-semibold mb-2">No diagrams yet</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Get started by creating a new diagram from scratch, using a template, or generating one with AI.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => router.push("/diagram/new")}>
          New Blank Diagram
        </Button>
        <Button variant="outline" onClick={() => router.push("/diagram/new?tab=templates")}>
          Use Template
        </Button>
        <Button variant="outline" onClick={() => router.push("/diagram/new?tab=ai")}>
          Generate with AI
        </Button>
      </div>
    </div>
  );
}
