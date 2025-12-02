"use client";

import React, { useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { ResizableSplitPane } from '@/components/ui/ResizableSplitPane';
import { MonacoEditorWrapper } from '@/components/ui/MonacoEditorWrapper';
import { MermaidRenderer } from '@/components/mermaid/MermaidRenderer';
import { useMermaidStore } from '@/store/useMermaidStore';
import { OnMount } from '@monaco-editor/react';

export default function MermaidPage() {
  const { mermaidCode, setMermaidCode } = useMermaidStore();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setMermaidCode(value);
    }
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <LayoutWrapper>
        {/* Temporary Flex Layout until SplitPane is fixed */}
        <div className="flex h-full w-full">
            <div className="flex-1 relative border-r h-full">
                <MonacoEditorWrapper
                  language="markdown"
                  value={mermaidCode}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    wordWrap: 'on',
                  }}
                />
            </div>
            <div className="flex-1 h-full overflow-hidden">
                <MermaidRenderer content={mermaidCode} />
            </div>
        </div>
      </LayoutWrapper>
    </div>
  );
}
