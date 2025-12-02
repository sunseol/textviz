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
        <ResizableSplitPane
          initialLeftWidth={40}
          left={
            <>
              <SymbolPalette onInsert={handleSymbolInsert} />
              <div style={{ height: 'calc(100vh - 3.5rem - 140px)' }}>
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
            </>
          }
          right={
            <LatexRenderer content={latex} />
          }
        />
      </LayoutWrapper>
    </div>
  );
}
