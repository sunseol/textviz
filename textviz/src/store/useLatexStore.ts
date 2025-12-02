import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LatexStore {
  latex: string;
  setLatex: (latex: string) => void;
}

export const useLatexStore = create<LatexStore>()(
  persist(
    (set) => ({
      latex: "\\documentclass{article}\n\n\\begin{document}\n\n\\title{Sample LaTeX Document}\n\\author{TextViz User}\n\\maketitle\n\n\\section{Introduction}\nThis is a sample document with a mathematical formula:\n\n$$ E = mc^2 $$
\n\\end{document}",
      setLatex: (latex) => set({ latex }),
    }),
    {
      name: 'textviz-latex-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
