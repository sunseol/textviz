"use client";

import React from 'react';
import Editor, { EditorProps, OnMount } from '@monaco-editor/react';
import { useAppStore } from '@/store/useAppStore';
import { Loader2 } from 'lucide-react';

interface MonacoEditorWrapperProps extends EditorProps {
  // Additional custom props if needed
}

export function MonacoEditorWrapper({
  options,
  theme,
  ...props
}: MonacoEditorWrapperProps) {
  const { isDarkMode } = useAppStore();

  // Merge default options with provided options
  const defaultOptions: EditorProps['options'] = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: { top: 16, bottom: 16 },
    wordWrap: 'on',
    fontFamily: 'var(--font-mono)', // Use the font defined in globals.css
    ...options,
  };

  // Determine theme based on dark mode state if not explicitly provided
  const editorTheme = theme || (isDarkMode ? 'vs-dark' : 'light');

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Add any global editor initialization logic here
    if (props.onMount) {
      props.onMount(editor, monaco);
    }
  };

  return (
    <Editor
      height="100%"
      width="100%"
      loading={
          <div className="flex items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading Editor...</span>
          </div>
      }
      theme={editorTheme}
      options={defaultOptions}
      onMount={handleEditorDidMount}
      {...props}
    />
  );
}
