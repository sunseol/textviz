"use client";

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Header } from '@/components/layout/Header';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { BlockLibrary } from '@/components/json-builder/BlockLibrary';
import { BuilderCanvas } from '@/components/json-builder/Canvas';
import { PropertyEditor } from '@/components/json-builder/PropertyEditor';

export default function JsonBuilderPage() {
  const { t } = useLanguageStore();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      <Header />
      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        {/* Main Editor Container */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-xl shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
          {/* Editor Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-4 py-2.5 dark:border-neutral-800 dark:bg-neutral-900/80">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {t.editor.untitled}.json
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
                {t.nav.jsonBuilder}
              </span>
              <span>{t.editor.autoSaved}</span>
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex-1 overflow-hidden">
            <div className="grid h-full w-full grid-cols-12 overflow-hidden">
              {/* Left Panel: Block Library */}
              <div className="col-span-3 md:col-span-2 border-r border-neutral-200 dark:border-neutral-800 h-full overflow-hidden">
                <BlockLibrary />
              </div>

              {/* Center Panel: Canvas */}
              <div className="col-span-6 md:col-span-7 h-full overflow-hidden">
                <BuilderCanvas />
              </div>

              {/* Right Panel: Properties & Output */}
              <div className="col-span-3 md:col-span-3 border-l border-neutral-200 dark:border-neutral-800 h-full overflow-hidden">
                <PropertyEditor />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
