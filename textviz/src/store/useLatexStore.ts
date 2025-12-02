import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LatexStore {
  latex: string;
  setLatex: (latex: string) => void;
}

export const useLatexStore = create<LatexStore>()(
  persist(
    (set) => ({
      // Default LaTeX document shown in the editor
      latex: String.raw`\documentclass{article}

\begin{document}

\title{Sample LaTeX Document}
\author{TextViz User}
\maketitle

\section{Introduction}
This is a sample document with a mathematical formula:

$$ E = mc^2 $$

\end{document}`,
      setLatex: (latex) => set({ latex }),
    }),
    {
      name: 'textviz-latex-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
