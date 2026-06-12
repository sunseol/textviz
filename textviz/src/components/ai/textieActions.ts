import type { DocumentType } from "@/store/useDocumentStore";

export type NavigateActionPayload = {
  readonly prompt: string;
  readonly type: DocumentType;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDocumentType(value: unknown): value is DocumentType {
  return value === "markdown" || value === "latex" || value === "mermaid" || value === "json-builder";
}

export function parseNavigateAction(content: string): NavigateActionPayload | null {
  try {
    const parsed: unknown = JSON.parse(content);
    if (!isRecord(parsed) || !isDocumentType(parsed.type) || typeof parsed.prompt !== "string") {
      return null;
    }
    return { prompt: parsed.prompt, type: parsed.type };
  } catch {
    return null;
  }
}

export function inferDocumentTypeFromPrompt(prompt: string): DocumentType {
  const lowerInput = prompt.toLowerCase();
  const isMermaid = ["다이어그램", "차트", "시퀀스", "플로우", "diagram", "chart", "graph", "mermaid"].some((keyword) =>
    lowerInput.includes(keyword),
  );
  if (isMermaid) {
    return "mermaid";
  }

  const isLatex = ["라텍스", "수식", "latex", "tex", "math", "formula", "equation"].some((keyword) =>
    lowerInput.includes(keyword),
  );
  if (isLatex) {
    return "latex";
  }

  return lowerInput.includes("json") ? "json-builder" : "markdown";
}
