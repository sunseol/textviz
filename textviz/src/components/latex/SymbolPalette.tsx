"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SymbolPaletteProps {
  onInsert: (symbol: string) => void;
}

const symbols = {
  greek: [
    { label: 'α', code: '\alpha' },
    { label: 'β', code: '\beta' },
    { label: 'γ', code: '\gamma' },
    { label: 'δ', code: '\delta' },
    { label: 'θ', code: '\theta' },
    { label: 'λ', code: '\lambda' },
    { label: 'μ', code: '\mu' },
    { label: 'π', code: '\pi' },
    { label: 'σ', code: '\sigma' },
    { label: 'ω', code: '\omega' },
    { label: 'Δ', code: '\Delta' },
    { label: 'Ω', code: '\Omega' },
  ],
  operators: [
    { label: '+', code: '+' },
    { label: '-', code: '-' },
    { label: '×', code: '\times' },
    { label: '÷', code: '\div' },
    { label: '±', code: '\pm' },
    { label: '∑', code: '\sum' },
    { label: '∏', code: '\prod' },
    { label: '∫', code: '\int' },
    { label: '√', code: '\sqrt{}' },
    { label: '∞', code: '\infty' },
  ],
  relations: [
    { label: '=', code: '=' },
    { label: '≠', code: '\neq' },
    { label: '≈', code: '\approx' },
    { label: '≤', code: '\leq' },
    { label: '≥', code: '\geq' },
    { label: '⊂', code: '\subset' },
    { label: '∈', code: '\in' },
  ],
  logic: [
    { label: '∀', code: '\forall' },
    { label: '∃', code: '\exists' },
    { label: '→', code: '\rightarrow' },
    { label: '⇒', code: '\Rightarrow' },
    { label: '↔', code: '\leftrightarrow' },
  ]
};

export function SymbolPalette({ onInsert }: SymbolPaletteProps) {
  return (
    <div className="border-b bg-muted/30 p-2">
       {/* Tabs 컴포넌트가 설치되지 않았을 수 있으므로, 우선 간단한 버튼 그룹으로 구현하거나 
           나중에 Tabs를 설치하고 업데이트합니다. 
           여기서는 Tabs 대신 간단한 카테고리 표시 없이 모두 나열하거나, 
           혹은 간단한 flex-wrap으로 보여줍니다. 
           일단은 간단하게 모든 심볼을 그룹지어 보여주겠습니다. 
       */}
       <div className="flex flex-wrap gap-1 overflow-x-auto pb-2">
          {Object.entries(symbols).map(([category, items]) => (
            <div key={category} className="flex items-center gap-1 border-r pr-2 mr-2 last:border-0">
              {items.map((item) => (
                <Button
                  key={item.code}
                  variant="ghost"
                  size="sm"
                  onClick={() => onInsert(item.code)}
                  className="h-8 w-8 p-0 text-lg font-serif"
                  title={item.code}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          ))}
       </div>
    </div>
  );
}
