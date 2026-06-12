"use client";

import React, { useMemo, useRef } from 'react';
import 'katex/dist/katex.min.css';
import { parseAndRenderLatex } from '@/lib/latex/renderLatex';

interface LatexRendererProps {
  content: string;
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
