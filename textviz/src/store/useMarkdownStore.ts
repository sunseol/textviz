import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface MarkdownStore {
  markdown: string;
  setMarkdown: (markdown: string) => void;
}

export const useMarkdownStore = create<MarkdownStore>()(
  persist(
    (set) => ({
      markdown: '# Welcome to Markdown Editor\n\nStart typing here...', 
      setMarkdown: (markdown) => set({ markdown }),
    }),
    {
      name: 'textviz-markdown-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
