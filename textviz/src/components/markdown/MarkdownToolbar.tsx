"use client";

import React from 'react';
import { 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  List, 
  ListOrdered, 
  Code, 
  Quote,
  Heading1,
  Heading2,
  Strikethrough,
  Minus
} from 'lucide-react';

interface MarkdownToolbarProps {
  onInsert: (prefix: string, suffix: string) => void;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function ToolbarButton({ icon, label, onClick }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-all duration-150 hover:bg-neutral-100 hover:text-neutral-900 active:scale-95 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
    >
      {icon}
    </button>
  );
}

function Divider() {
  return <div className="mx-1.5 h-5 w-px bg-neutral-200 dark:bg-neutral-700" />;
}

export function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  return (
    <div className="flex items-center gap-0.5 border-b border-neutral-200/80 bg-neutral-50/80 px-3 py-2 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80">
      {/* Text formatting */}
      <ToolbarButton
        icon={<Bold className="h-4 w-4" />}
        label="Bold (Ctrl+B)"
        onClick={() => onInsert('**', '**')}
      />
      <ToolbarButton
        icon={<Italic className="h-4 w-4" />}
        label="Italic (Ctrl+I)"
        onClick={() => onInsert('*', '*')}
      />
      <ToolbarButton
        icon={<Strikethrough className="h-4 w-4" />}
        label="Strikethrough"
        onClick={() => onInsert('~~', '~~')}
      />
      
      <Divider />
      
      {/* Headings */}
      <ToolbarButton
        icon={<Heading1 className="h-4 w-4" />}
        label="Heading 1"
        onClick={() => onInsert('# ', '')}
      />
      <ToolbarButton
        icon={<Heading2 className="h-4 w-4" />}
        label="Heading 2"
        onClick={() => onInsert('## ', '')}
      />
      
      <Divider />
      
      {/* Links & Media */}
      <ToolbarButton
        icon={<LinkIcon className="h-4 w-4" />}
        label="Insert Link"
        onClick={() => onInsert('[', '](url)')}
      />
      <ToolbarButton
        icon={<ImageIcon className="h-4 w-4" />}
        label="Insert Image"
        onClick={() => onInsert('![alt text](', ')')}
      />
      
      <Divider />
      
      {/* Lists */}
      <ToolbarButton
        icon={<List className="h-4 w-4" />}
        label="Bullet List"
        onClick={() => onInsert('- ', '')}
      />
      <ToolbarButton
        icon={<ListOrdered className="h-4 w-4" />}
        label="Numbered List"
        onClick={() => onInsert('1. ', '')}
      />
      
      <Divider />
      
      {/* Code & Quote */}
      <ToolbarButton
        icon={<Code className="h-4 w-4" />}
        label="Inline Code"
        onClick={() => onInsert('`', '`')}
      />
      <ToolbarButton
        icon={<Quote className="h-4 w-4" />}
        label="Blockquote"
        onClick={() => onInsert('> ', '')}
      />
      <ToolbarButton
        icon={<Minus className="h-4 w-4" />}
        label="Horizontal Rule"
        onClick={() => onInsert('\n---\n', '')}
      />
    </div>
  );
}
