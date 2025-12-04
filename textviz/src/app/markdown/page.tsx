"use client";

import React, { useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { ResizableSplitPane } from '@/components/ui/ResizableSplitPane';
import { MonacoEditorWrapper } from '@/components/ui/MonacoEditorWrapper';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { MarkdownToolbar } from '@/components/markdown/MarkdownToolbar';
import { OnMount } from '@monaco-editor/react';
import { DocumentSidebar } from '@/components/layout/DocumentSidebar';

export default function MarkdownPage() {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const [mounted, setMounted] = React.useState(false);

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
    setMounted(true);
    // Create initial document if none exists
    if (documents.filter(d => d.type === 'markdown').length === 0) {
      addDocument('markdown');
    }
  }, []);

  const markdown = activeDocument?.type === 'markdown' ? activeDocument.content : '';

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeDocument) {
      updateDocument(activeDocument.id, value);
    }
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  if (!mounted) return null;

  const handleToolbarInsert = (prefix: string, suffix: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    const model = editor.getModel();
    if (!model) return;

    // Use current selection or fall back to the caret position
    const activeSelection = editor.getSelection();
    const caretPosition = editor.getPosition();
    if (!activeSelection && !caretPosition) return;

    const selection = activeSelection ?? {
      startLineNumber: caretPosition!.lineNumber,
      startColumn: caretPosition!.column,
      endLineNumber: caretPosition!.lineNumber,
      endColumn: caretPosition!.column,
    };

    const text = model.getValueInRange(selection);
    const newText = `${prefix}${text}${suffix}`;

    editor.executeEdits('toolbar', [
      {
        range: selection,
        text: newText,
        forceMoveMarkers: true,
      },
    ]);

    // Place the cursor just after the prefix (inside the wrapper) when no text was selected,
    // otherwise at the end of the inserted block.
    const targetColumn =
      selection.startColumn +
      prefix.length +
      (text.length > 0 ? text.length + suffix.length : 0);

    editor.setPosition({
      lineNumber: selection.startLineNumber,
      column: targetColumn,
    });

    editor.revealPositionInCenter({
      lineNumber: selection.startLineNumber,
      column: targetColumn,
    });

    editor.focus();
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      <Header />
      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        {/* Sidebar */}
        <div className="hidden shrink-0 lg:block">
          <DocumentSidebar active="markdown" />
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
                {activeDocument?.title || `${t.editor.untitled}.md`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
                {t.nav.markdown}
              </span>
              <span>{t.editor.autoSaved}</span>
            </div>
          </div>

          {/* Split Pane */}
          <div className="flex-1 overflow-hidden">
            <ResizableSplitPane
              initialLeftWidth={50}
              left={
                <>
                  <MarkdownToolbar onInsert={handleToolbarInsert} />
                  <div style={{ height: 'calc(100vh - 160px)' }}>
                    <MonacoEditorWrapper
                      language="markdown"
                      value={markdown}
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
                </>
              }
              right={
                <MarkdownRenderer content={markdown} />
              }
            />
          </div>
        </div>
      </div>
    </div >
  );
}
