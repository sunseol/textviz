## Error Type
Build Error

## Error Message
Parsing ecmascript source code failed

## Build Output
./src/store/useLatexStore.ts:13:3
Parsing ecmascript source code failed
  11 |     (set) => ({
  12 |       latex: "\\documentclass{article}\n\n\\begin{document}\n\n\\title{Sample LaTeX Document}\n\\author{TextViz User}\n\\maketitle\n\n\\section{Introduction}\nThis is a sample document with a mathematical formula:\n\n$$ E = mc^2 $$
> 13 | \n\\end{document}",
     |   ^
  14 |       setLatex: (latex) => set({ latex }),
  15 |     }),
  16 |     {

Expected unicode escape

Import traces:
  Client Component Browser:
    ./src/store/useLatexStore.ts [Client Component Browser]
    ./src/components/home/RecentFiles.tsx [Client Component Browser]
    ./src/app/page.tsx [Client Component Browser]
    ./src/app/page.tsx [Server Component]

  Client Component SSR:
    ./src/store/useLatexStore.ts [Client Component SSR]
    ./src/components/home/RecentFiles.tsx [Client Component SSR]
    ./src/app/page.tsx [Client Component SSR]
    ./src/app/page.tsx [Server Component]

Next.js version: 16.0.6 (Turbopack)
