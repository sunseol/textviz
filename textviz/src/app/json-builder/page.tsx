"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { BlockLibrary } from '@/components/json-builder/BlockLibrary';
import { BuilderCanvas } from '@/components/json-builder/Canvas';
import { PropertyEditor } from '@/components/json-builder/PropertyEditor';

export default function JsonBuilderPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <LayoutWrapper>
        <div className="grid h-full w-full grid-cols-12 overflow-hidden">
          {/* Left Panel: Block Library (20%) */}
          <div className="col-span-3 md:col-span-2 border-r h-full overflow-hidden">
            <BlockLibrary />
          </div>

          {/* Center Panel: Canvas (50%) */}
          <div className="col-span-6 md:col-span-7 h-full overflow-hidden">
            <BuilderCanvas />
          </div>

          {/* Right Panel: Properties & Output (30%) */}
          <div className="col-span-3 md:col-span-3 border-l h-full overflow-hidden">
            <PropertyEditor />
          </div>
        </div>
      </LayoutWrapper>
    </div>
  );
}
