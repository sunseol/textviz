export type DocumentType = "markdown" | "latex" | "mermaid" | "json-builder";

export type DocumentMetadata = {
  readonly language?: string;
  readonly intent?: string;
  readonly deadline?: string;
  readonly tone?: string;
  readonly description?: string;
};

export type Document = {
  readonly id: string;
  readonly type: DocumentType;
  readonly title: string;
  readonly content: string;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly user_id?: string;
  readonly isLocal?: boolean;
  readonly metadata?: DocumentMetadata;
};

export type DocumentUpdate = {
  readonly content?: string;
  readonly title?: string;
  readonly metadata?: DocumentMetadata;
};

export type RemoteDocumentRow = {
  readonly id: string;
  readonly type: DocumentType;
  readonly title: string;
  readonly content: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly user_id?: string;
  readonly metadata?: DocumentMetadata | null;
};

export type DocumentDbUpdate = {
  readonly updated_at: string;
  readonly content?: string;
  readonly title?: string;
  readonly metadata?: DocumentMetadata;
};

export function isDocumentType(value: unknown): value is DocumentType {
  return (
    value === "markdown" ||
    value === "latex" ||
    value === "mermaid" ||
    value === "json-builder"
  );
}
