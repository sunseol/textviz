"use client";

import React, { useEffect, useState } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import Link from 'next/link';
import { FileText, Sigma, GitGraph, Clock } from 'lucide-react';

export function RecentFiles() {
  const [mounted, setMounted] = useState(false);
  const documents = useDocumentStore((state) => state.documents);
  const fetchDocuments = useDocumentStore((state) => state.fetchDocuments);
  const setActiveDocument = useDocumentStore((state) => state.setActiveDocument);
  const { t } = useLanguageStore();

  useEffect(() => {
    setMounted(true);
    fetchDocuments();
  }, [fetchDocuments]);

  const getRecentDoc = (type: string) => {
    const docs = documents.filter((doc) => doc.type === type);
    return docs.sort((a, b) => b.updatedAt - a.updatedAt)[0];
  };

  if (!mounted) return null;

  const items = [
    {
      type: 'markdown',
      label: t.nav.markdown,
      href: '/markdown',
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      type: 'latex',
      label: t.nav.latex,
      href: '/latex',
      icon: Sigma,
      color: 'text-green-500',
    },
    {
      type: 'mermaid',
      label: t.nav.mermaid,
      href: '/mermaid',
      icon: GitGraph,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-2xl font-bold tracking-tight">{t.home.recentFiles}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const recentDoc = getRecentDoc(item.type);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (recentDoc) {
                  setActiveDocument(recentDoc.id);
                }
              }}
              className="group flex flex-col gap-2 rounded-lg border p-4 hover:border-primary/50 hover:shadow-md transition-all bg-card"
            >
              <div className="flex items-center gap-2">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="font-medium">{item.label}</span>
                {recentDoc && <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(recentDoc.updatedAt).toLocaleDateString()}
                </span>}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3 font-mono bg-muted/30 p-2 rounded h-16 overflow-hidden">
                {recentDoc?.content || `(${t.editor.empty})`}
              </p>
              <div className="text-[10px] text-muted-foreground mt-auto pt-2 truncate">
                {recentDoc?.title || t.editor.untitled}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
