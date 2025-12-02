"use client";

import React, { useEffect, useState } from 'react';
import { useMarkdownStore } from '@/store/useMarkdownStore';
import { useLatexStore } from '@/store/useLatexStore';
import { useMermaidStore } from '@/store/useMermaidStore';
import Link from 'next/link';
import { FileText, Sigma, GitGraph, Clock } from 'lucide-react';

export function RecentFiles() {
  const [mounted, setMounted] = useState(false);
  const markdown = useMarkdownStore((state) => state.markdown);
  const latex = useLatexStore((state) => state.latex);
  const mermaidCode = useMermaidStore((state) => state.mermaidCode);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const items = [
    {
      type: 'Markdown',
      href: '/markdown',
      content: markdown,
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      type: 'LaTeX',
      href: '/latex',
      content: latex,
      icon: Sigma,
      color: 'text-green-500',
    },
    {
      type: 'Mermaid',
      href: '/mermaid',
      content: mermaidCode,
      icon: GitGraph,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-2xl font-bold tracking-tight">Recent Works</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.type}
            href={item.href}
            className="group flex flex-col gap-2 rounded-lg border p-4 hover:border-primary/50 hover:shadow-md transition-all bg-card"
          >
            <div className="flex items-center gap-2">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="font-medium">{item.type} Draft</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-3 font-mono bg-muted/30 p-2 rounded h-16 overflow-hidden">
              {item.content || '(Empty)'}
            </p>
            <div className="text-[10px] text-muted-foreground mt-auto pt-2">
              Auto-saved
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
