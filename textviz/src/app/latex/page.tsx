"use client";

import React, { useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { ResizableSplitPane } from '@/components/ui/ResizableSplitPane';
import { MonacoEditorWrapper } from '@/components/ui/MonacoEditorWrapper';
import { LatexRenderer } from '@/components/latex/LatexRenderer';
import { SymbolPalette } from '@/components/latex/SymbolPalette';
import { useLatexStore } from '@/store/useLatexStore';
import { OnMount } from '@monaco-editor/react';
import { DocumentSidebar } from '@/components/layout/DocumentSidebar';

export default function LatexPage() {
  const { latex, setLatex } = useLatexStore();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setLatex(value);
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <LayoutWrapper>
        <div className="grid min-h-[calc(100vh-10rem)] grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
          <DocumentSidebar active="latex" />
          <div className="relative h-full min-h-[calc(100vh-12rem)] overflow-hidden rounded-3xl border border-white/40 bg-white/80 shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/70">
            <ResizableSplitPane
              initialLeftWidth={42}
              left={
                <div className="flex h-full flex-col">
                  <SymbolPalette onInsert={handleSymbolInsert} />
                  <div className="flex-1 min-h-0">
                    <MonacoEditorWrapper
                      language="markdown"
                      value={latex}
                      onChange={handleEditorChange}
                      onMount={handleEditorDidMount}
                      options={{
                        minimap: { enabled: false },
                        wordWrap: 'on',
                      }}
                    />
                  </div>
                </div>
              }
              right={<LatexRenderer content={latex} />}
            />
          </div>
        </div>
      </LayoutWrapper>
    </div>
  );
}
