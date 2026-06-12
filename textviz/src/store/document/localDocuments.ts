import type { Document } from "./types";
import { isDocumentType } from "./types";

const LOCAL_STORAGE_KEY = "textviz-documents";
const ACTIVE_DOCUMENT_KEY = "textviz-active-doc";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStoredDocument(value: unknown): value is Document {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    isDocumentType(value.type) &&
    typeof value.title === "string" &&
    typeof value.content === "string" &&
    typeof value.createdAt === "number" &&
    typeof value.updatedAt === "number"
  );
}

export function getLocalDocs(): Document[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isStoredDocument) : [];
  } catch {
    return [];
  }
}

export function getLocalActiveId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(ACTIVE_DOCUMENT_KEY);
}

export function saveLocalDocs(docs: readonly Document[]): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(docs));
}

export function saveLocalActiveId(id: string | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (id) {
    localStorage.setItem(ACTIVE_DOCUMENT_KEY, id);
    return;
  }

  localStorage.removeItem(ACTIVE_DOCUMENT_KEY);
}

export function clearLocalDocs(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}
