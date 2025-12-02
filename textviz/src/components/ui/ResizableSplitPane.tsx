"use client";

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface ResizableSplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  initialLeftWidth?: number; // Percentage (e.g., 50 for 50%)
  minLeftWidth?: number; // Percentage
  maxLeftWidth?: number; // Percentage
}

export function ResizableSplitPane({
  left,
  right,
  initialLeftWidth = 50,
  minLeftWidth = 20,
  maxLeftWidth = 80,
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
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  return (
    <div ref={containerRef} className="grid w-full overflow-hidden" style={{ gridTemplateColumns: `${leftWidth}% 4px 1fr`, gridTemplateRows: '1fr', height: '100%' }}>
      <div className="overflow-hidden flex flex-col" style={{ height: '100%' }}>
        {left}
      </div>

      <div
        className={cn(
          "cursor-col-resize bg-border hover:bg-primary/50 active:bg-primary flex items-center justify-center transition-colors z-10 relative",
          isDragging && "bg-primary"
        )}
        onMouseDown={handleMouseDown}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground/50 absolute pointer-events-none" />
      </div>

      <div className="overflow-hidden bg-background" style={{ height: '100%' }}>
        {right}
      </div>
    </div>
  );
}
