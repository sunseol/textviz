"use client";

import React from 'react';
import { useJsonBuilderStore } from '@/store/useJsonBuilderStore';
import { Button } from '@/components/ui/button';
import { X, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

function SortableItem({ id, block, isSelected, onSelect, onRemove }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 p-3 bg-white dark:bg-neutral-800 border rounded-lg mb-2 shadow-sm transition-all",
        isSelected ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
      )}
      onClick={() => onSelect(block.id)}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
        <GripVertical className="h-5 w-5" />
      </div>
      
      <div className="flex-1">
        <div className="font-medium text-sm">{block.name}</div>
        <div className="text-xs text-muted-foreground">{block.template}</div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(block.id);
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function BuilderCanvas() {
  const { canvasBlocks, reorderCanvasBlocks, removeBlockFromCanvas, selectedBlockId, selectBlock } = useJsonBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      reorderCanvasBlocks(active.id as string, over!.id as string);
    }
  };

  return (
    <div className="flex-1 h-full bg-gray-100 dark:bg-neutral-950 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Canvas</h2>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={canvasBlocks.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {canvasBlocks.length === 0 ? (
                <div className="border-2 border-dashed rounded-xl p-12 text-center text-muted-foreground">
                    <p>Canvas is empty.</p>
                    <p className="text-sm mt-2">Add blocks from the library to start building.</p>
                </div>
            ) : (
                canvasBlocks.map((block) => (
                <SortableItem
                    key={block.id}
                    id={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={selectBlock}
                    onRemove={removeBlockFromCanvas}
                />
                ))
            )}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
