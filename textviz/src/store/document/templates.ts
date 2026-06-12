import type { Document, DocumentType } from "./types";

export const defaultTemplates: Record<DocumentType, string> = {
  markdown: "# Welcome to Markdown Editor\n\nStart typing here...",
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
  "json-builder": '{"prompt":"","blocks":[]}',
};

export function getDefaultTitle(type: DocumentType, documents: readonly Document[]): string {
  const extension = type === "markdown" ? "md" : type === "latex" ? "tex" : type === "mermaid" ? "mmd" : "json";
  const prefix = "Untitled-";
  const existingNumbers = documents
    .filter((doc) => doc.title.startsWith(prefix) && doc.title.endsWith(`.${extension}`))
    .map((doc) => {
      const match = doc.title.match(/Untitled-(\d+)\./);
      return match ? Number.parseInt(match[1], 10) : 0;
    });

  return `${prefix}${Math.max(0, ...existingNumbers) + 1}.${extension}`;
}
