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
            <div className="flex flex-col h-full">
              <SymbolPalette onInsert={handleSymbolInsert} />
              <div className="flex-1 relative">
                <MonacoEditorWrapper
                  language="markdown" // Use markdown for syntax highlighting in LaTeX (Monaco has limited native LaTeX support, or use 'latex' if available but 'markdown' is often better for mixed content)
                  // Or better: we can stick to 'markdown' or try to find if 'latex' works well. Monaco usually treats 'latex' as plain text or requires custom language definition.
                  // Let's use 'markdown' as it highlights commands partially, or plain text. 
                  // Actually, let's try 'latex' first, if not supported it falls back.
                  // Update: Monaco built-in languages include 'stex' (for LaTeX). Let's use that if possible, or 'markdown'.
                  // Let's use 'markdown' for now as it's safer and supports mixed content which KaTeX renderers handle.
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
          right={
            <LatexRenderer content={latex} />
          }
        />
      </LayoutWrapper>
    </div>
  );
}
