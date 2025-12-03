"use client";

import React, { useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { ResizableSplitPane } from '@/components/ui/ResizableSplitPane';
import { MonacoEditorWrapper } from '@/components/ui/MonacoEditorWrapper';
import { MermaidRenderer } from '@/components/mermaid/MermaidRenderer';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { OnMount } from '@monaco-editor/react';
import { DocumentSidebar } from '@/components/layout/DocumentSidebar';

export default function MermaidPage() {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const documents = useDocumentStore((state) => state.documents);
  const activeDocumentId = useDocumentStore((state) => state.activeDocumentId);
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const addDocument = useDocumentStore((state) => state.addDocument);
  const { t } = useLanguageStore();
  
  const activeDocument = React.useMemo(() => 
    documents.find(doc => doc.id === activeDocumentId) || null,
    [documents, activeDocumentId]
  );

  React.useEffect(() => {
    // Create initial document if none exists
    if (documents.filter(d => d.type === 'mermaid').length === 0) {
      addDocument('mermaid');
    }
  }, []);

  const mermaidCode = activeDocument?.type === 'mermaid' ? activeDocument.content : '';

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeDocument) {
      updateDocument(activeDocument.id, value);
    }
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      <Header />
      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        {/* Sidebar */}
        <div className="hidden w-60 shrink-0 lg:block">
          <DocumentSidebar active="mermaid" />
        </div>

        {/* Main Editor Container */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-xl shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
          {/* Editor Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-4 py-2.5 dark:border-neutral-800 dark:bg-neutral-900/80">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {activeDocument?.title || 'Untitled.mmd'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
                {t.nav.mermaid}
              </span>
              <span>{t.editor.autoSaved}</span>
            </div>
          </div>

          {/* Split Pane */}
          <div className="flex-1 overflow-hidden">
            <ResizableSplitPane
              initialLeftWidth={50}
              left={
                <div style={{ height: 'calc(100vh - 160px)' }}>
                  <MonacoEditorWrapper
                    language="markdown"
                    value={mermaidCode}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    options={{
                      minimap: { enabled: false },
                      wordWrap: 'on',
                      lineHeight: 1.7,
                      fontSize: 14,
                      padding: { top: 16, bottom: 16 },
                      renderLineHighlight: 'gutter',
                      scrollbar: {
                        verticalScrollbarSize: 8,
                        horizontalScrollbarSize: 8,
                      },
                    }}
                  />
                </div>
              }
              right={<MermaidRenderer content={mermaidCode} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
