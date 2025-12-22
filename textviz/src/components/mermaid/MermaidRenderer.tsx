"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { AlertCircle } from 'lucide-react';

interface MermaidRendererProps {
  content: string;
}

export function MermaidRenderer({ content }: MermaidRendererProps) {
  const ref = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
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

        // Clean up content: Remove ```mermaid wrapper if present and backticks
        let cleanContent = content
          .replace(/```mermaid/g, '')
          .replace(/```/g, '')
          .trim();

        if (!cleanContent) {
          ref.current.innerHTML = '';
          setError(null);
          return;
        }

        // Validate syntax first
        await mermaid.parse(cleanContent);

        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, cleanContent);
        ref.current.innerHTML = svg;

        const svgEl = ref.current.querySelector('svg');
        if (svgEl) {
          // Use the rendered viewBox to fill the preview container
          const w = svgEl.getAttribute('width');
          const h = svgEl.getAttribute('height');
          const vb = svgEl.getAttribute('viewBox');

          // Ensure viewBox exists
          if (!vb && w && h) {
            svgEl.setAttribute('viewBox', `0 0 ${parseFloat(w)} ${parseFloat(h)}`);
          }

          // Force natural size
          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');
          svgEl.style.width = 'auto';
          svgEl.style.height = 'auto';
          svgEl.style.maxWidth = 'none';
          svgEl.style.maxHeight = 'none';
          svgEl.style.display = 'block';
          svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');

          // Reset transform to 1:1 and center
          if (transformRef.current) {
            transformRef.current.centerView(1, 0);
          }
        }
        setError(null);
      } catch (err) {
        // Suppress console error for expected syntax errors during typing
        const errorMessage = err instanceof Error ? err.message : "Syntax Error";
        if (errorMessage.includes('Parse error') || errorMessage.includes('UnknownDiagramError')) {
          console.warn("Mermaid Syntax Error (handled):", errorMessage);
        } else {
          console.error("Mermaid Render Error:", err);
        }

        setError(errorMessage);
      }
    };

    const timeoutId = setTimeout(() => {
      renderDiagram();
    }, 500); // Debounce rendering

    return () => clearTimeout(timeoutId);
  }, [content]);

  return (
    <div
      className="h-full min-h-[420px] w-full relative overflow-hidden flex flex-col"
      style={{
        backgroundColor: '#f8fafc',
        backgroundImage:
          'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)',
        backgroundSize: '20px 20px',
      }}
    >
      {error && (
        <div className="absolute top-4 left-4 right-4 z-10 bg-destructive/10 border border-destructive text-destructive p-3 rounded-md flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span className="font-medium">Error:</span>
          <span className="truncate">{error}</span>
        </div>
      )}
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.1}
        maxScale={8}
        centerOnInit={true}
        limitToBounds={false}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
        panning={{ velocityDisabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform, centerView }) => (
          <>
            <div className="absolute right-4 top-4 z-20 flex flex-col gap-2 rounded-lg border border-neutral-200/70 bg-white/90 p-2 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80">
              <button
                type="button"
                onClick={() => zoomIn()}
                className="rounded-md px-3 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => zoomOut()}
                className="rounded-md px-3 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => {
                  centerView(1, 0);
                }}
                className="rounded-md px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Reset
              </button>
            </div>
            <TransformComponent
              wrapperClass="absolute inset-0 w-full h-full"
              wrapperStyle={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              contentClass="h-full w-full p-2"
            >
              <div
                id="mermaid-preview"
                ref={ref}
                className="relative min-h-[480px] min-w-[320px]"
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
