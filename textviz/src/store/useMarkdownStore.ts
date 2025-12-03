import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface MarkdownStore {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  resetMarkdown: () => void;
}

const defaultMarkdown = '# Welcome to Markdown Editor\n\nStart typing here...';

export const useMarkdownStore = create<MarkdownStore>()(
  persist(
    (set) => ({
      markdown: defaultMarkdown,
      setMarkdown: (markdown) => set({ markdown }),
      resetMarkdown: () => set({ markdown: defaultMarkdown }),
    }),
    {
      name: 'textviz-markdown-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
