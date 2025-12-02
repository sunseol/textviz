"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div 
      id="markdown-preview" 
      className="h-full w-full overflow-auto bg-white px-8 py-6 dark:bg-neutral-950"
    >
      {/* Preview Header */}
      <div className="mb-6 flex items-center gap-2 border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-100 dark:bg-emerald-900/30">
          <svg className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Preview</span>
      </div>
      
      {/* Markdown Content */}
      <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h1:border-b prose-h1:border-neutral-200 prose-h1:pb-2 prose-h1:dark:border-neutral-800 prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-p:text-neutral-700 prose-p:dark:text-neutral-300 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:dark:text-blue-400 prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-code:dark:bg-neutral-800 prose-pre:rounded-lg prose-pre:bg-neutral-900 prose-pre:dark:bg-neutral-950 prose-blockquote:border-l-4 prose-blockquote:border-neutral-300 prose-blockquote:bg-neutral-50 prose-blockquote:py-1 prose-blockquote:pl-4 prose-blockquote:not-italic prose-blockquote:dark:border-neutral-700 prose-blockquote:dark:bg-neutral-900/50 prose-hr:border-neutral-200 prose-hr:dark:border-neutral-800 prose-img:rounded-lg prose-table:text-sm prose-th:bg-neutral-100 prose-th:dark:bg-neutral-800">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            // Custom code block styling
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match;
              
              if (isInline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
              
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
      
      {/* Empty state */}
      {!content.trim() && (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
          <svg className="mb-3 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">Start typing to see preview</p>
        </div>
      )}
    </div>
  );
}