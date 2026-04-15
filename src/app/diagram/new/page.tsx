"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { templates } from "@/lib/mock-data/templates";
import { blankDiagram } from "@/lib/mock-data/templates";
import { createDiagram } from "@/lib/services/diagram-service";
import { generateDiagram } from "@/lib/services/ai-service";

type Tab = "blank" | "templates" | "ai";

function NewDiagramForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "blank";

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateBlank = () => {
    const diagram = {
      ...blankDiagram,
      title: title || "Untitled Diagram",
      description,
      metadata: {
        ...blankDiagram.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    const { summary } = createDiagram(diagram);
    router.push(`/diagram/${summary.id}`);
  };

  const handleUseTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;
    const diagram = {
      ...template.diagram,
      title: title || template.diagram.title,
      description: description || template.diagram.description,
      metadata: {
        ...template.diagram.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    const { summary } = createDiagram(diagram);
    router.push(`/diagram/${summary.id}`);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);

    // TODO: Replace with real LLM call
    const result = await generateDiagram({ prompt: aiPrompt });
    const diagram = {
      ...result.diagram,
      title: title || result.diagram.title,
      description: description || result.diagram.description,
    };
    const { summary } = createDiagram(diagram);
    setIsGenerating(false);
    router.push(`/diagram/${summary.id}`);
  };

  const tabItems: { id: Tab; label: string }[] = [
    { id: "blank", label: "Blank Diagram" },
    { id: "templates", label: "Templates" },
    { id: "ai", label: "Generate with AI" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/diagrams")}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <h1 className="text-lg font-semibold">New Diagram</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Common fields */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="text-sm font-medium">Title (optional)</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Architecture Diagram"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description (optional)</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of this diagram"
              className="mt-1"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px
                ${activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "blank" && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-muted-foreground mb-6">
              Start with an empty canvas and build your architecture from scratch.
            </p>
            <Button onClick={handleCreateBlank}>Create Blank Diagram</Button>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <Card key={tpl.id} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleUseTemplate(tpl.id)}>
                <CardHeader>
                  <div className="h-24 bg-muted rounded flex items-center justify-center mb-2">
                    <svg className="w-10 h-10 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-sm">{tpl.name}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{tpl.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "ai" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Describe the architecture you want, and AI will generate a diagram for you.
            </p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. A microservices architecture for an e-commerce platform with a React frontend, API gateway, user service, product catalog, order service, and PostgreSQL databases"
              rows={4}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm
                placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button onClick={handleAiGenerate} disabled={isGenerating || !aiPrompt.trim()}>
              {isGenerating ? "Generating..." : "Generate Diagram"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Note: This is using a mock AI response. Real LLM integration is a TODO.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function NewDiagramPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>}>
      <NewDiagramForm />
    </Suspense>
  );
}
