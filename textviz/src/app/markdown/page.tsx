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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setMarkdown(value);
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
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <LayoutWrapper>
        <ResizableSplitPane
          initialLeftWidth={50}
          left={
            <>
              <MarkdownToolbar onInsert={handleToolbarInsert} />
              <div style={{ height: 'calc(100vh - 3.5rem - 48px)' }}>
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
            </>
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
