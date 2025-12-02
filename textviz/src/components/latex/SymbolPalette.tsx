"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SymbolPaletteProps {
  onInsert: (symbol: string) => void;
}

type SymbolCategory = {
  id: string;
  label: string;
  symbols: { label: string; code: string }[];
};

const categories: SymbolCategory[] = [
  {
    id: 'greek',
    label: 'Greek',
    symbols: [
      { label: 'α', code: '\\alpha' },
      { label: 'β', code: '\\beta' },
      { label: 'γ', code: '\\gamma' },
      { label: 'δ', code: '\\delta' },
      { label: 'θ', code: '\\theta' },
      { label: 'λ', code: '\\lambda' },
      { label: 'μ', code: '\\mu' },
      { label: 'π', code: '\\pi' },
      { label: 'σ', code: '\\sigma' },
      { label: 'ω', code: '\\omega' },
      { label: 'Δ', code: '\\Delta' },
      { label: 'Ω', code: '\\Omega' },
    ],
  },
  {
    id: 'operators',
    label: 'Operators',
    symbols: [
      { label: '×', code: '\\times' },
      { label: '÷', code: '\\div' },
      { label: '±', code: '\\pm' },
      { label: '∑', code: '\\sum' },
      { label: '∏', code: '\\prod' },
      { label: '∫', code: '\\int' },
      { label: '√', code: '\\sqrt{}' },
      { label: '∞', code: '\\infty' },
    ],
  },
  {
    id: 'relations',
    label: 'Relations',
    symbols: [
      { label: '≠', code: '\\neq' },
      { label: '≈', code: '\\approx' },
      { label: '≤', code: '\\leq' },
      { label: '≥', code: '\\geq' },
      { label: '⊂', code: '\\subset' },
      { label: '∈', code: '\\in' },
    ],
  },
  {
    id: 'logic',
    label: 'Logic',
    symbols: [
      { label: '∀', code: '\\forall' },
      { label: '∃', code: '\\exists' },
      { label: '→', code: '\\rightarrow' },
      { label: '⇒', code: '\\Rightarrow' },
      { label: '↔', code: '\\leftrightarrow' },
    ],
  },
];

export function SymbolPalette({ onInsert }: SymbolPaletteProps) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0].id);

  const activeSymbols =
    categories.find((category) => category.id === activeCategory)?.symbols ?? [];

  return (
    <div className="border-b bg-muted/30 p-2">
      {/* Simple category toggles instead of a full tab component */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={category.id === activeCategory ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className="whitespace-nowrap"
          >
            {category.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
        {activeSymbols.map((item) => (
          <Button
            key={item.code}
            variant="outline"
            size="sm"
            onClick={() => onInsert(item.code)}
            className="h-10 w-10 p-0 text-lg font-serif"
            title={item.code}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
