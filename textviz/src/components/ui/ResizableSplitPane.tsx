"use client";

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResizableSplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  initialLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
}

export function ResizableSplitPane({
  left,
  right,
  initialLeftWidth = 50,
  minLeftWidth = 25,
  maxLeftWidth = 75,
}: ResizableSplitPaneProps) {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      if (newLeftWidth >= minLeftWidth && newLeftWidth <= maxLeftWidth) {
        setLeftWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  return (
    <div 
      ref={containerRef} 
      className="grid h-full w-full overflow-hidden rounded-xl"
      style={{ gridTemplateColumns: `${leftWidth}% 1px 1fr` }}
    >
      {/* Left Panel - Editor */}
      <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-neutral-950">
        {left}
      </div>

      {/* Divider */}
      <div
        className={cn(
          "group relative z-20 flex cursor-col-resize items-center justify-center",
          "before:absolute before:inset-y-0 before:-left-1 before:-right-1 before:z-10",
          isDragging && "before:bg-blue-500/10"
        )}
        onMouseDown={handleMouseDown}
      >
        {/* Visual divider line */}
        <div 
          className={cn(
            "h-full w-px transition-all duration-150",
            "bg-neutral-200 dark:bg-neutral-800",
            "group-hover:w-1 group-hover:bg-blue-500/50",
            isDragging && "w-1 bg-blue-500"
          )}
        />
        
        {/* Drag handle indicator */}
        <div 
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "flex h-8 w-4 items-center justify-center rounded-full",
            "bg-neutral-100 opacity-0 shadow-sm transition-all duration-150 dark:bg-neutral-800",
            "group-hover:opacity-100",
            isDragging && "opacity-100 bg-blue-500 dark:bg-blue-500"
          )}
        >
          <div className="flex flex-col gap-0.5">
            <div className={cn("h-0.5 w-1 rounded-full bg-neutral-400 dark:bg-neutral-500", isDragging && "bg-white")} />
            <div className={cn("h-0.5 w-1 rounded-full bg-neutral-400 dark:bg-neutral-500", isDragging && "bg-white")} />
            <div className={cn("h-0.5 w-1 rounded-full bg-neutral-400 dark:bg-neutral-500", isDragging && "bg-white")} />
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="h-full overflow-hidden border-l border-neutral-100 bg-neutral-50/50 dark:border-neutral-900 dark:bg-neutral-900/50">
        {right}
      </div>
    </div>
  );
}
