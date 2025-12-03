"use client";

import React from 'react';
import { useJsonBuilderStore } from '@/store/useJsonBuilderStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BlockLibrary() {
  const { library, addBlockToCanvas } = useJsonBuilderStore();
  const { t } = useLanguageStore();

  return (
    <div className="flex flex-col h-full border-r bg-gray-50/50 dark:bg-neutral-900/50">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{t.jsonBuilder.library}</h2>
        <p className="text-sm text-muted-foreground">{t.jsonBuilder.dragOrClick}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {library.map((block) => (
          <div
            key={block.id}
            className="p-3 bg-white dark:bg-neutral-800 border rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => addBlockToCanvas(block)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">{block.name}</span>
              <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{block.description}</p>
            <div className="mt-2 flex gap-1">
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground uppercase tracking-wider",
                block.category === 'style' && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                block.category === 'subject' && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                block.category === 'camera' && "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
              )}>
                {block.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
