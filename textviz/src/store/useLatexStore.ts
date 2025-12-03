import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LatexStore {
  latex: string;
  setLatex: (latex: string) => void;
  resetLatex: () => void;
}

const defaultLatex = String.raw`\documentclass{article}

\begin{document}

\title{Sample LaTeX Document}
\author{TextViz User}
\maketitle

\section{Introduction}
This is a sample document with a mathematical formula:

$$ E = mc^2 $$

\end{document}`;

export const useLatexStore = create<LatexStore>()(
  persist(
    (set) => ({
      // Default LaTeX document shown in the editor
      latex: defaultLatex,
      setLatex: (latex) => set({ latex }),
      resetLatex: () => set({ latex: defaultLatex }),
    }),
    {
      name: 'textviz-latex-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
