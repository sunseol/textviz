"use client";

import React, { useMemo, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
  content: string;
}

// Parse content and render LaTeX math expressions
function parseAndRenderLatex(content: string): { html: string; errors: string[] } {
  if (!content) return { html: '', errors: [] };
  
  const errors: string[] = [];
  let result = content;
  
  // Remove LaTeX comments (% to end of line, but not \%)
  result = result.replace(/(?<!\\)%.*$/gm, '');
  
  // Remove preamble commands (before \begin{document} or if no document environment)
  // These are configuration commands that don't render
  result = result
    // Document class and packages
    .replace(/\\documentclass(\[[^\]]*\])?\{[^}]*\}/g, '')
    .replace(/\\usepackage(\[[^\]]*\])?\{[^}]*\}/g, '')
    // Page geometry and settings
    .replace(/\\geometry\{[^}]*\}/g, '')
    .replace(/\\hypersetup\{[\s\S]*?\}/g, '')
    .replace(/\\pagestyle\{[^}]*\}/g, '')
    .replace(/\\setlength\{[^}]*\}\{[^}]*\}/g, '')
    .replace(/\\renewcommand\{[^}]*\}\{[^}]*\}/g, '')
    .replace(/\\newcommand\{[^}]*\}(\[[^\]]*\])?\{[^}]*\}/g, '')
    // Bibliography and index
    .replace(/\\bibliographystyle\{[^}]*\}/g, '')
    .replace(/\\bibliography\{[^}]*\}/g, '')
    // Table of contents commands
    .replace(/\\tableofcontents/g, '')
    .replace(/\\listoffigures/g, '')
    .replace(/\\listoftables/g, '')
    // Label and ref (keep for now, just remove)
    .replace(/\\label\{[^}]*\}/g, '')
    .replace(/\\ref\{[^}]*\}/g, '[ref]')
    .replace(/\\cite\{[^}]*\}/g, '[cite]')
    // Input and include
    .replace(/\\input\{[^}]*\}/g, '')
    .replace(/\\include\{[^}]*\}/g, '');
  
  // Render display math: $$ ... $$ or \[ ... \]
  result = result.replace(/\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/g, (match, p1, p2) => {
    const latex = p1 || p2;
    try {
      return `<div class="katex-display-wrapper">${katex.renderToString(latex.trim(), {
        displayMode: true,
        throwOnError: false,
        trust: true,
        strict: false,
      })}</div>`;
    } catch (e) {
      errors.push(`Display math error: ${e}`);
      return `<div class="latex-error">${match}</div>`;
    }
  });
  
  // Render inline math: $ ... $ or \( ... \)
  result = result.replace(/\$([^$\n]+?)\$|\\\(([^)]+?)\\\)/g, (match, p1, p2) => {
    const latex = p1 || p2;
    try {
      return katex.renderToString(latex.trim(), {
        displayMode: false,
        throwOnError: false,
        trust: true,
        strict: false,
      });
    } catch (e) {
      errors.push(`Inline math error: ${e}`);
      return `<span class="latex-error">${match}</span>`;
    }
  });
  
  // Process text formatting FIRST (so nested commands like \title{\textbf{...}} work)
  // Apply multiple times to handle nested formatting
  for (let i = 0; i < 3; i++) {
    result = result
      .replace(/\\textbf\{([^{}]*)\}/g, '<strong>$1</strong>')
      .replace(/\\textit\{([^{}]*)\}/g, '<em>$1</em>')
      .replace(/\\underline\{([^{}]*)\}/g, '<u>$1</u>')
      .replace(/\\emph\{([^{}]*)\}/g, '<em>$1</em>')
      .replace(/\\texttt\{([^{}]*)\}/g, '<code>$1</code>')
      .replace(/\\textrm\{([^{}]*)\}/g, '$1')
      .replace(/\\textsf\{([^{}]*)\}/g, '$1')
      .replace(/\\textsc\{([^{}]*)\}/g, '<span style="font-variant: small-caps">$1</span>');
  }
  
  // Convert LaTeX document structure to HTML
  result = result
    // Title, author, date from preamble
    .replace(/\\title\{([^}]*)\}/g, '<h1 class="latex-title">$1</h1>')
    .replace(/\\author\{([^}]*)\}/g, '<p class="latex-author">$1</p>')
    .replace(/\\date\{([^}]*)\}/g, '<p class="latex-date">$1</p>')
    .replace(/\\maketitle/g, '')
    
    // Document structure
    .replace(/\\begin\{document\}/g, '')
    .replace(/\\end\{document\}/g, '')
    .replace(/\\documentclass(\[[^\]]*\])?\{[^}]*\}/g, '')
    .replace(/\\usepackage(\[[^\]]*\])?\{[^}]*\}/g, '')
    
    // Sections
    .replace(/\\section\*?\{([^}]*)\}/g, '<h2 class="latex-section">$1</h2>')
    .replace(/\\subsection\*?\{([^}]*)\}/g, '<h3 class="latex-subsection">$1</h3>')
    .replace(/\\subsubsection\*?\{([^}]*)\}/g, '<h4 class="latex-subsubsection">$1</h4>')
    .replace(/\\paragraph\{([^}]*)\}/g, '<p class="latex-paragraph"><strong>$1</strong> ')
    
    // Lists
    .replace(/\\begin\{itemize\}/g, '<ul class="latex-list">')
    .replace(/\\end\{itemize\}/g, '</ul>')
    .replace(/\\begin\{enumerate\}/g, '<ol class="latex-list">')
    .replace(/\\end\{enumerate\}/g, '</ol>')
    .replace(/\\item\s*/g, '<li>')
    
    // Environment blocks
    .replace(/\\begin\{center\}/g, '<div class="text-center">')
    .replace(/\\end\{center\}/g, '</div>')
    .replace(/\\begin\{quote\}/g, '<blockquote class="latex-quote">')
    .replace(/\\end\{quote\}/g, '</blockquote>')
    .replace(/\\begin\{abstract\}/g, '<div class="latex-abstract"><h4>Abstract</h4>')
    .replace(/\\end\{abstract\}/g, '</div>')
    
    // Equation environments (already rendered as math)
    .replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, (_, eq) => {
      try {
        return `<div class="katex-display-wrapper">${katex.renderToString(eq.trim(), {
          displayMode: true,
          throwOnError: false,
        })}</div>`;
      } catch {
        return `<div class="latex-error">${eq}</div>`;
      }
    })
    .replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, (_, eq) => {
      try {
        // Convert align to aligned for KaTeX
        const aligned = `\\begin{aligned}${eq}\\end{aligned}`;
        return `<div class="katex-display-wrapper">${katex.renderToString(aligned.trim(), {
          displayMode: true,
          throwOnError: false,
        })}</div>`;
      } catch {
        return `<div class="latex-error">${eq}</div>`;
      }
    })
    
    // Special characters
    .replace(/\\&/g, '&amp;')
    .replace(/\\%/g, '%')
    .replace(/\\\$/g, '$')
    .replace(/\\#/g, '#')
    .replace(/\\_/g, '_')
    .replace(/\\{/g, '{')
    .replace(/\\}/g, '}')
    .replace(/\\ldots/g, '…')
    .replace(/\\cdots/g, '⋯')
    .replace(/---/g, '—')
    .replace(/--/g, '–')
    .replace(/``/g, '"')
    .replace(/''/g, '"')
    
    // Line breaks and spacing
    .replace(/\\\\/g, '<br/>')
    .replace(/\\newline/g, '<br/>')
    .replace(/\\par\b/g, '</p><p>')
    .replace(/\\vspace\{[^}]*\}/g, '<div style="margin: 1em 0;"></div>')
    .replace(/\\hspace\{[^}]*\}/g, ' ')
    .replace(/\\quad/g, '&emsp;')
    .replace(/\\qquad/g, '&emsp;&emsp;')
    .replace(/~/g, '&nbsp;')
    
    // Clean up remaining LaTeX commands
    .replace(/\\[a-zA-Z]+(\{[^}]*\})?/g, '');
  
  // Wrap paragraphs (lines separated by blank lines)
  result = result
    .split(/\n\s*\n/)
    .map(para => para.trim())
    .filter(para => para.length > 0)
    .map(para => {
      // Don't wrap if it's already an HTML block element
      if (para.match(/^<(h[1-6]|div|ul|ol|blockquote|p)/i)) {
        return para;
      }
      return `<p>${para}</p>`;
    })
    .join('\n');
  
  return { html: result, errors };
}

export function LatexRenderer({ content }: LatexRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { html, errors } = useMemo(() => parseAndRenderLatex(content), [content]);

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900 overflow-auto">
      {/* Preview Header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-neutral-200 bg-neutral-50/95 backdrop-blur px-4 py-2 dark:border-neutral-800 dark:bg-neutral-900/95">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-purple-100 dark:bg-purple-900/30">
          <svg className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Preview</span>
        {errors.length > 0 && (
          <span className="ml-auto text-xs text-amber-600 dark:text-amber-400">
            {errors.length} warning{errors.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Paper-like preview */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl">
          <div 
            ref={containerRef}
            id="latex-preview"
            className="latex-document bg-white dark:bg-neutral-800 shadow-xl rounded-lg text-neutral-900 dark:text-neutral-100"
            style={{
              padding: '3rem',
              minHeight: '600px',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      {/* Inline styles for LaTeX rendering */}
      <style jsx global>{`
        .latex-document {
          font-family: 'Computer Modern', 'Latin Modern', Georgia, 'Times New Roman', serif;
          font-size: 1.1rem;
          line-height: 1.8;
        }
        
        .latex-document p {
          margin-bottom: 1em;
          text-align: justify;
        }
        
        .latex-title {
          font-size: 1.75rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 0.5rem;
          color: inherit;
        }
        
        .latex-author {
          text-align: center;
          font-style: italic;
          margin-bottom: 0.25rem;
          color: inherit;
          opacity: 0.8;
        }
        
        .latex-date {
          text-align: center;
          margin-bottom: 2rem;
          color: inherit;
          opacity: 0.7;
        }
        
        .latex-section {
          font-size: 1.4rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: inherit;
        }
        
        .latex-subsection {
          font-size: 1.2rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: inherit;
        }
        
        .latex-subsubsection {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: inherit;
        }
        
        .latex-list {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        .latex-list li {
          margin-bottom: 0.5em;
        }
        
        .latex-quote {
          margin: 1.5em 2em;
          padding-left: 1em;
          border-left: 3px solid #ccc;
          font-style: italic;
        }
        
        .latex-abstract {
          margin: 2em 3em;
          font-size: 0.95em;
        }
        
        .latex-abstract h4 {
          text-align: center;
          font-weight: 600;
          margin-bottom: 0.5em;
        }
        
        .katex-display-wrapper {
          margin: 1.5em 0;
          text-align: center;
        }
        
        .katex-display {
          margin: 0 !important;
        }
        
        .katex-display-wrapper .katex-display > .katex {
          white-space: normal;
        }
        
        .katex-display-wrapper .katex {
          font-size: 1.1em;
        }
        
        .latex-document .katex {
          font-size: 1em;
        }
        
        .latex-error {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 4px;
          padding: 0.25em 0.5em;
          color: #dc2626;
          font-family: monospace;
          font-size: 0.9em;
        }
        
        .dark .latex-error {
          background-color: #450a0a;
          border-color: #7f1d1d;
          color: #f87171;
        }
        
        .dark .latex-quote {
          border-left-color: #525252;
        }
      `}</style>
    </div>
  );
}
