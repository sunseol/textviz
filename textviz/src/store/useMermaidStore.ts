import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface MermaidStore {
  mermaidCode: string;
  setMermaidCode: (code: string) => void;
}

export const useMermaidStore = create<MermaidStore>()(
  persist(
    (set) => ({
      mermaidCode: 'graph TD\n  A[Start] --> B{Is it?}\n  B -- Yes --> C[OK]\n  C --> D[Rethink]\n  D --> B\n  B -- No --> E[End]',
      setMermaidCode: (code) => set({ mermaidCode: code }),
    }),
    {
      name: 'textviz-mermaid-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
