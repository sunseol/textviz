"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { AlertCircle } from 'lucide-react';

interface MermaidRendererProps {
  content: string;
}

export function MermaidRenderer({ content }: MermaidRendererProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!ref.current) return;

      try {
        // Clear previous content
        ref.current.innerHTML = '';
        
        // Validate syntax first using parse (if available) or just try render
        // Note: mermaid.parse is async in newer versions
        await mermaid.parse(content);
        
        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, content);
        ref.current.innerHTML = svg;
        setError(null);
      } catch (err) {
        console.error("Mermaid Render Error:", err);
        if (err instanceof Error) {
             setError(err.message);
        } else {
             setError("Syntax Error");
        }
      }
    };

    const timeoutId = setTimeout(() => {
        renderDiagram();
    }, 500); // Debounce rendering

    return () => clearTimeout(timeoutId);
  }, [content]);

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-neutral-900 relative overflow-hidden flex flex-col">
       {error && (
         <div className="absolute top-4 left-4 right-4 z-10 bg-destructive/10 border border-destructive text-destructive p-3 rounded-md flex items-center gap-2 text-sm">
           <AlertCircle className="h-4 w-4" />
           <span className="font-medium">Error:</span>
           <span className="truncate">{error}</span>
         </div>
       )}
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit={true}
      >
        <TransformComponent wrapperClass="h-full w-full" contentClass="h-full w-full flex items-center justify-center">
          <div id="mermaid-preview" ref={ref} className="min-w-[100px] min-h-[100px]" />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
