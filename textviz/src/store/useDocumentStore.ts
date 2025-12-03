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
}

interface DocumentStore {
  documents: Document[];
  activeDocumentId: string | null;
  isLoading: boolean;

  fetchDocuments: () => Promise<void>;
  addDocument: (type: DocumentType) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  updateDocument: (id: string, content: string) => Promise<void>;
  setActiveDocument: (id: string) => void;
  getActiveDocument: () => Document | null;
  getDocumentsByType: (type: DocumentType) => Document[];
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

const getDefaultTitle = (type: DocumentType, count: number): string => {
  const extension = type === 'markdown' ? 'md' : type === 'latex' ? 'tex' : type === 'mermaid' ? 'mmd' : 'json';
  return `Untitled-${count + 1}.${extension}`;
};

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  activeDocumentId: null,
  isLoading: false,

  fetchDocuments: async () => {
    set({ isLoading: true });
    const supabase = createClient();

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      set({ documents: [], isLoading: false });
      return;
    }

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      set({ isLoading: false });
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
    }));

    set({ documents, isLoading: false });

    // Set active document if none selected and documents exist
    if (!get().activeDocumentId && documents.length > 0) {
      // Try to restore last active document from local storage or default to first
      // For now, just first
      // set({ activeDocumentId: documents[0].id });
    }
  },

  addDocument: async (type: DocumentType) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Handle local-only mode or prompt login?
      // For now, we'll just add to local state but it won't persist if we refresh
      // Or we could enforce login. Let's enforce login for saving for now, or just show alert.
      alert('Please login to create documents');
      return;
    }

    const documents = get().documents;
    const typeDocuments = documents.filter(doc => doc.type === type);
    const title = getDefaultTitle(type, typeDocuments.length);
    const content = defaultTemplates[type];

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
    };

    set({
      documents: [newDoc, ...documents],
      activeDocumentId: newDoc.id,
    });
  },

  deleteDocument: async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting document:', error);
      return;
    }

    const documents = get().documents.filter(doc => doc.id !== id);
    const activeDocumentId = get().activeDocumentId;

    set({
      documents,
      activeDocumentId: activeDocumentId === id ? (documents[0]?.id || null) : activeDocumentId,
    });
  },

  updateDocument: async (id: string, content: string) => {
    // Optimistic update
    set({
      documents: get().documents.map(doc =>
        doc.id === id
          ? { ...doc, content, updatedAt: Date.now() }
          : doc
      ),
    });

    // Debounce this? For now, direct update.
    const supabase = createClient();
    const { error } = await supabase
      .from('documents')
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating document:', error);
      // Revert?
    }
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
