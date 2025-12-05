import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export type DocumentType = 'markdown' | 'latex' | 'mermaid' | 'json-builder';

export interface Document {
  id: string;
  type: DocumentType;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  user_id?: string;
  isLocal?: boolean; // Marker to explicitly show it's local
}

interface DocumentStore {
  documents: Document[];
  activeDocumentId: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  fetchDocuments: () => Promise<void>;
  setIsInitialized: (isInitialized: boolean) => void;
  addDocument: (type: DocumentType) => Promise<Document | void>;
  deleteDocument: (id: string) => Promise<void>;
  updateDocument: (id: string, updates: { content?: string; title?: string }) => Promise<void>;
  setActiveDocument: (id: string) => void;
  getActiveDocument: () => Document | null;
  getDocumentsByType: (type: DocumentType) => Document[];
  syncLocalDocuments: () => Promise<number>; // Returns count of synced docs
}

const defaultTemplates: Record<DocumentType, string> = {
  markdown: '# Welcome to Markdown Editor\n\nStart typing here...',
  latex: String.raw`\title{Mathematical Formulas}
\author{TextViz User}
\maketitle

\section{Basic Equations}

The famous mass-energy equivalence:
$$ E = mc^2 $$

The quadratic formula for $ax^2 + bx + c = 0$:
$$ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$

\section{Calculus}

The derivative of a function:
$$ \frac{d}{dx}[f(x)] = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h} $$

Integration:
$$ \int_a^b f(x)\,dx = F(b) - F(a) $$

\section{Linear Algebra}

A matrix equation:
$$ \begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} e \\ f \end{pmatrix} $$

\section{Summations and Products}

Summation:
$$ \sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6} $$

Product notation:
$$ \prod_{i=1}^{n} i = n! $$`,
  mermaid: `graph TD
  A[Start] --> B{Is it?}
  B -- Yes --> C[OK]
  C --> D[Rethink]
  D --> B
  B -- No --> E[End]`,
  'json-builder': '{"prompt":"","blocks":[]}',
};

const LOCAL_STORAGE_KEY = 'textviz-documents';

const getDefaultTitle = (type: DocumentType, count: number): string => {
  const extension = type === 'markdown' ? 'md' : type === 'latex' ? 'tex' : type === 'mermaid' ? 'mmd' : 'json';
  return `Untitled-${count + 1}.${extension}`;
};

// Helper for LocalStorage
const getLocalDocs = (): Document[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLocalDocs = (docs: Document[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(docs));
};

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  activeDocumentId: null,
  isLoading: false,
  isInitialized: false,

  setIsInitialized: (isInitialized: boolean) => set({ isInitialized }),

  fetchDocuments: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Remote Mode
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        set({ isLoading: false, isInitialized: true });
        return;
      }

      const documents: Document[] = data.map(doc => ({
        id: doc.id,
        type: doc.type as DocumentType,
        title: doc.title,
        content: doc.content,
        createdAt: new Date(doc.created_at).getTime(),
        updatedAt: new Date(doc.updated_at).getTime(),
        user_id: doc.user_id,
        isLocal: false,
      }));

      set({ documents, isLoading: false, isInitialized: true });
    } else {
      // Local Mode
      const localDocs = getLocalDocs();
      set({ documents: localDocs, isLoading: false, isInitialized: true });
    }

    // Set active document if needed
    if (!get().activeDocumentId) {
      // Optional: restore active ID logic
    }
  },

  addDocument: async (type: DocumentType) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const documents = get().documents;
    const typeDocuments = documents.filter(doc => doc.type === type);
    const title = getDefaultTitle(type, typeDocuments.length);
    const content = defaultTemplates[type];

    if (user) {
      // Add to Supabase
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          type,
          title,
          content,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating document:', error);
        return;
      }

      const newDoc: Document = {
        id: data.id,
        type: data.type as DocumentType,
        title: data.title,
        content: data.content,
        createdAt: new Date(data.created_at).getTime(),
        updatedAt: new Date(data.updated_at).getTime(),
        user_id: data.user_id,
        isLocal: false,
      };

      set({
        documents: [newDoc, ...documents],
        activeDocumentId: newDoc.id,
      });
      return newDoc;
    } else {
      // Add to Local
      const newDoc: Document = {
        id: crypto.randomUUID(),
        type,
        title,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isLocal: true,
      };

      const newDocuments = [newDoc, ...documents];
      saveLocalDocs(newDocuments);

      set({
        documents: newDocuments,
        activeDocumentId: newDoc.id,
      });
      return newDoc;
    }
  },

  deleteDocument: async (id: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // If it happens to be a lingering local doc (shouldn't happen in strict mode but possible),
      // we should check. But assuming we only show remote docs when logged in (except during sync),
      // we can try deleting from remote.
      const docToDelete = get().documents.find(d => d.id === id);
      if (!docToDelete?.isLocal) {
        const { error } = await supabase
          .from('documents')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting document:', error);
          return;
        }
      }
    }

    // Local delete (or UI update for remote)
    const documents = get().documents.filter(doc => doc.id !== id);
    if (!user) {
      saveLocalDocs(documents); // Persist local delete
    }

    const activeDocumentId = get().activeDocumentId;

    set({
      documents,
      activeDocumentId: activeDocumentId === id ? (documents[0]?.id || null) : activeDocumentId,
    });
  },

  updateDocument: async (id: string, updates: { content?: string; title?: string }) => {
    // 1. Optimistic Update
    const currentDocuments = get().documents;
    const docIndex = currentDocuments.findIndex(d => d.id === id);
    if (docIndex === -1) return;

    const oldDoc = currentDocuments[docIndex];
    const newDoc = {
      ...oldDoc,
      ...updates,
      updatedAt: Date.now(),
    };

    const newDocuments = [...currentDocuments];
    newDocuments[docIndex] = newDoc;

    set({ documents: newDocuments });

    // 2. Persist
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user && !newDoc.isLocal) {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.content !== undefined) dbUpdates.content = updates.content;
      if (updates.title !== undefined) dbUpdates.title = updates.title;

      const { error } = await supabase
        .from('documents')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.error('Error updating document:', error);
        // Might want to revert optimistic update here in a real app
      }
    } else {
      // Local Storage Update
      saveLocalDocs(newDocuments);
    }
  },

  syncLocalDocuments: async () => {
    const localDocs = getLocalDocs();
    if (localDocs.length === 0) return 0;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    let syncedCount = 0;

    for (const doc of localDocs) {
      const { error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          type: doc.type,
          title: doc.title, // Keep title, duplicates allowed
          content: doc.content,
        });

      if (!error) {
        syncedCount++;
      } else {
        console.error('Failed to sync doc:', doc.title, error);
      }
    }

    if (syncedCount > 0) {
      // Clear local storage after successful sync
      // We assume if one failed, we probably don't want to delete ALL, but
      // for simplicity in this version, we clear if at least one worked (or maybe we should only remove synced ones?)
      // Let's clear all for now to avoid complexity of partial sync management.
      if (syncedCount === localDocs.length) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } else {
        // Partial clear likely needed, but keeping it simple: just fetch fresh from remote
      }

      await get().fetchDocuments(); // Refresh from server
    }

    return syncedCount;
  },

  setActiveDocument: (id: string) => {
    set({ activeDocumentId: id });
  },

  getActiveDocument: () => {
    const { documents, activeDocumentId } = get();
    return documents.find(doc => doc.id === activeDocumentId) || null;
  },

  getDocumentsByType: (type: DocumentType) => {
    return get().documents.filter(doc => doc.type === type);
  },
}));
