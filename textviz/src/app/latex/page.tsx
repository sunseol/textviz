"use client";

import React, { useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { ResizableSplitPane } from '@/components/ui/ResizableSplitPane';
import { MonacoEditorWrapper } from '@/components/ui/MonacoEditorWrapper';
import { LatexRenderer } from '@/components/latex/LatexRenderer';
import { SymbolPalette } from '@/components/latex/SymbolPalette';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { OnMount } from '@monaco-editor/react';
import { DocumentSidebar } from '@/components/layout/DocumentSidebar';
import { EditorHeader } from '@/components/layout/EditorHeader';
import { MobileSidebar } from '@/components/layout/MobileSidebar';

export default function LatexPage() {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const documents = useDocumentStore((state) => state.documents);
  const activeDocumentId = useDocumentStore((state) => state.activeDocumentId);
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const addDocument = useDocumentStore((state) => state.addDocument);
  const isInitialized = useDocumentStore((state) => state.isInitialized);
  const { t } = useLanguageStore();

  const activeDocument = React.useMemo(() =>
    documents.find(doc => doc.id === activeDocumentId) || null,
    [documents, activeDocumentId]
  );

  React.useEffect(() => {
    setMounted(true);
    // Create initial document if none exists
    if (isInitialized && documents.filter(d => d.type === 'latex').length === 0) {
      addDocument('latex');
    }
  }, [isInitialized, documents]);

  const latex = activeDocument?.type === 'latex' ? activeDocument.content : '';

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeDocument) {
      updateDocument(activeDocument.id, { content: value });
    }
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleSymbolInsert = (symbol: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    if (!selection) return;

    const model = editor.getModel();
    if (!model) return;

    // Insert symbol at cursor position or replace selection
    editor.executeEdits('symbol-palette', [
      {
        range: selection,
        text: symbol,
        forceMoveMarkers: true,
      },
    ]);

    editor.focus();
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      <Header />
      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        {/* Sidebar */}
        <div className="hidden shrink-0 lg:block">
          <DocumentSidebar active="latex" />
        </div>

        {/* Main Editor Container */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-xl shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
          {/* Editor Header */}
          {/* Editor Header */}
          <EditorHeader
            title={activeDocument?.title || `${t.editor.untitled}.tex`}
            typeLabel={t.nav.latex}
            onTitleChange={(newTitle) => {
              if (activeDocument) {
                updateDocument(activeDocument.id, { title: newTitle });
              }
            }}
            onMobileMenuClick={() => setMobileMenuOpen(true)}
          />

          {/* Split Pane */}
          <div className="flex-1 overflow-hidden">
            <ResizableSplitPane
              initialLeftWidth={50}
              left={
                <div className="flex flex-col h-full">
                  <SymbolPalette onInsert={handleSymbolInsert} />
                  <div className="flex-1 min-h-0">
                    <MonacoEditorWrapper
                      language="latex"
                      value={latex}
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
                </div>
              }
              right={<LatexRenderer content={latex} />}
            />
          </div>
        </div>
      </div>

      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        active="latex"
      />
    </div>
  );
}
