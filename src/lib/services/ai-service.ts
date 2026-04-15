// ---------------------------------------------------------------------------
// Mock AI Service
// TODO: Replace with real LLM integration. The interface is designed so that
// the LLM receives canonical JSON + user prompt and returns updated canonical
// JSON. The editor simply swaps the document.
// ---------------------------------------------------------------------------

import { CanonicalDiagram } from "@/lib/types/canonical";
import { microservicesTemplate } from "@/lib/mock-data/templates";

export interface AiGenerateRequest {
  prompt: string;
  existingDiagram?: CanonicalDiagram;
}

export interface AiGenerateResponse {
  diagram: CanonicalDiagram;
  message: string;
}

/**
 * Mock AI generation — returns a canned diagram regardless of prompt.
 * In production this would send { prompt, existingDiagram } to an LLM
 * and parse the returned canonical JSON.
 */
export async function generateDiagram(
  request: AiGenerateRequest,
): Promise<AiGenerateResponse> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1500));

  const diagram: CanonicalDiagram = request.existingDiagram
    ? {
        ...request.existingDiagram,
        metadata: {
          ...request.existingDiagram.metadata,
          updatedAt: new Date().toISOString(),
          notes: `AI modification: "${request.prompt}"`,
        },
      }
    : {
        ...microservicesTemplate,
        title: "AI-Generated Diagram",
        description: `Generated from prompt: "${request.prompt}"`,
        metadata: {
          ...microservicesTemplate.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          notes: `AI generated from: "${request.prompt}"`,
          tags: ["ai-generated"],
        },
      };

  return {
    diagram,
    message:
      "This is a mock response. In production, the LLM would analyze your prompt and return an updated canonical diagram.",
  };
}
