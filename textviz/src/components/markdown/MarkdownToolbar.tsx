"use client";

import React from 'react';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, List, ListOrdered, Code, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarkdownToolbarProps {
  onInsert: (prefix: string, suffix: string) => void;
}

export function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  return (
    <div className="flex items-center space-x-1 border-b p-2 bg-muted/50 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsert('**', '**')}
        title="Bold"
        className="h-8 w-8"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsert('*', '*')}
        title="Italic"
        className="h-8 w-8"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsert('[', '](url)')}
        title="Link"
        className="h-8 w-8"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsert('![alt text](', ')')}
        title="Image"
        className="h-8 w-8"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsert('- ', '')}
        title="Unordered List"
        className="h-8 w-8"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsert('1. ', '')}
        title="Ordered List"
        className="h-8 w-8"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsert('`', '`')}
        title="Inline Code"
        className="h-8 w-8"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsert('> ', '')}
        title="Quote"
        className="h-8 w-8"
      >
        <Quote className="h-4 w-4" />
      </Button>
    </div>
  );
}
