"use client";

import React, { useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { ResizableSplitPane } from '@/components/ui/ResizableSplitPane';
import { MonacoEditorWrapper } from '@/components/ui/MonacoEditorWrapper';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { useMarkdownStore } from '@/store/useMarkdownStore';
import { MarkdownToolbar } from '@/components/markdown/MarkdownToolbar';
import { OnMount } from '@monaco-editor/react';

export default function MarkdownPage() {
  const { markdown, setMarkdown } = useMarkdownStore();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setMarkdown(value);
    }
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleToolbarInsert = (prefix: string, suffix: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    if (!selection) return;

    const model = editor.getModel();
    if (!model) return;

    const text = model.getValueInRange(selection);
    const newText = `${prefix}${text}${suffix}`;

    editor.executeEdits('toolbar', [
      {
        range: selection,
        text: newText,
        forceMoveMarkers: true,
      },
    ]);
    
    // Optional: Adjust cursor position if no text was selected
    if (text.length === 0) {
        const position = editor.getPosition();
        if (position) {
             editor.setPosition({
                 lineNumber: position.lineNumber,
                 column: position.column - suffix.length
             });
        }
    }

    editor.focus();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <LayoutWrapper>
        <ResizableSplitPane
          initialLeftWidth={50}
          left={
            <div className="flex flex-col h-full">
              <MarkdownToolbar onInsert={handleToolbarInsert} />
              <div className="flex-1 relative">
                <MonacoEditorWrapper
                  language="markdown"
                  value={markdown}
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
            <div className="h-full w-full overflow-auto bg-white dark:bg-neutral-900">
              <MarkdownRenderer content={markdown} />
            </div>
          }
        />
      </LayoutWrapper>
    </div>
  );
}
