"use client";

import React, { useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { ResizableSplitPane } from '@/components/ui/ResizableSplitPane';
import { MonacoEditorWrapper } from '@/components/ui/MonacoEditorWrapper';
import { MermaidRenderer } from '@/components/mermaid/MermaidRenderer';
import { useMermaidStore } from '@/store/useMermaidStore';
import { OnMount } from '@monaco-editor/react';
import { DocumentSidebar } from '@/components/layout/DocumentSidebar';

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
        <div className="grid min-h-[calc(100vh-10rem)] grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
          <DocumentSidebar active="mermaid" />
          <div className="relative h-full min-h-[calc(100vh-12rem)] overflow-hidden rounded-3xl border border-white/40 bg-white/80 shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/70">
            <div className="flex h-full w-full">
              <div className="relative h-full flex-1 border-r border-white/40 dark:border-white/10">
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
          </div>
        </div>
      </LayoutWrapper>
    </div>
  );
}
