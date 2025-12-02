"use client";

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
  content: string;
}

function latexToReadableMarkdown(content: string) {
  if (!content) return '';

  const start = content.indexOf('\\begin{document}');
  const end = content.lastIndexOf('\\end{document}');

  const preamble = start !== -1 ? content.slice(0, start) : '';
  let body =
    start !== -1 && end !== -1 && end > start
      ? content.slice(start + '\\begin{document}'.length, end)
      : content;

  const title = /\\title\{([^}]*)\}/.exec(preamble)?.[1];
  const author = /\\author\{([^}]*)\}/.exec(preamble)?.[1];
  const date = /\\date\{([^}]*)\}/.exec(preamble)?.[1];

  // Basic structural mapping to Markdown
  body = body
    .replace(/\\maketitle/g, '')
    .replace(/\\section\{([^}]*)\}/g, '\n## $1\n')
    .replace(/\\subsection\{([^}]*)\}/g, '\n### $1\n')
    .replace(/\\subsubsection\{([^}]*)\}/g, '\n#### $1\n')
    .replace(/\\paragraph\{([^}]*)\}/g, '\n**$1** ');

  const headingLines = [];
  if (title) headingLines.push(`# ${title}`);
  if (author || date) headingLines.push(`*${[author, date].filter(Boolean).join(' · ')}*`);

  return `${headingLines.join('\n')}${headingLines.length ? '\n\n' : ''}${body.trim()}`;
}

export function LatexRenderer({ content }: LatexRendererProps) {
  const renderedContent = useMemo(() => latexToReadableMarkdown(content), [content]);

  return (
    <div className="flex justify-center min-h-full bg-gray-100 dark:bg-neutral-900 py-8 overflow-auto">
      <div 
        id="latex-preview"
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
          {renderedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
