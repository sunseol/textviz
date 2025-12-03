import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type DocumentType = 'markdown' | 'latex' | 'mermaid';

export interface Document {
  id: string;
  type: DocumentType;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface DocumentStore {
  documents: Document[];
  activeDocumentId: string | null;
  addDocument: (type: DocumentType) => void;
  deleteDocument: (id: string) => void;
  updateDocument: (id: string, content: string) => void;
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
};

const generateId = () => `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getDefaultTitle = (type: DocumentType, count: number): string => {
  const extension = type === 'markdown' ? 'md' : type === 'latex' ? 'tex' : 'mmd';
  return `Untitled-${count + 1}.${extension}`;
};

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: [],
      activeDocumentId: null,

      addDocument: (type: DocumentType) => {
        const documents = get().documents;
        const typeDocuments = documents.filter(doc => doc.type === type);
        const newDoc: Document = {
          id: generateId(),
          type,
          title: getDefaultTitle(type, typeDocuments.length),
          content: defaultTemplates[type],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set({
          documents: [...documents, newDoc],
          activeDocumentId: newDoc.id,
        });
      },

      deleteDocument: (id: string) => {
        const documents = get().documents.filter(doc => doc.id !== id);
        const activeDocumentId = get().activeDocumentId;

        set({
          documents,
          activeDocumentId: activeDocumentId === id ? (documents[0]?.id || null) : activeDocumentId,
        });
      },

      updateDocument: (id: string, content: string) => {
        set({
          documents: get().documents.map(doc =>
            doc.id === id
              ? { ...doc, content, updatedAt: Date.now() }
              : doc
          ),
        });
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
    }),
    {
      name: 'textviz-documents-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
