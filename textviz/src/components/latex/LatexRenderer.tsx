"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
  content: string;
}

export function LatexRenderer({ content }: LatexRendererProps) {
  return (
    <div className="flex justify-center min-h-full bg-gray-100 dark:bg-neutral-900 py-8 overflow-auto">
      <div 
        className="bg-white dark:bg-neutral-800 shadow-lg text-black dark:text-white prose prose-neutral dark:prose-invert max-w-none"
        style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '20mm',
            boxSizing: 'border-box'
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}