"use client";

import React, { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Button } from '@/components/ui/button';

interface SymbolPaletteProps {
  onInsert: (symbol: string) => void;
}

type SymbolCategory = {
  id: string;
  label: string;
  symbols: { label: string; code: string; tooltip?: string }[];
};

const categories: SymbolCategory[] = [
  {
    id: 'templates',
    label: 'Templates',
    symbols: [
      { label: '∑', code: '\\sum_{i=1}^{n} ', tooltip: 'Sum' },
      { label: '∏', code: '\\prod_{i=1}^{n} ', tooltip: 'Product' },
      { label: '∫', code: '\\int_{a}^{b} ', tooltip: 'Integral' },
      { label: '∮', code: '\\oint ', tooltip: 'Contour integral' },
      { label: 'lim', code: '\\lim_{x \\to \\infty} ', tooltip: 'Limit' },
      { label: '√', code: '\\sqrt{x}', tooltip: 'Square root' },
      { label: 'ⁿ√', code: '\\sqrt[n]{x}', tooltip: 'nth root' },
      { label: 'a/b', code: '\\frac{a}{b}', tooltip: 'Fraction' },
      { label: '(ⁿₖ)', code: '\\binom{n}{k}', tooltip: 'Binomial' },
    ],
  },
  {
    id: 'greek',
    label: 'Greek',
    symbols: [
      { label: 'α', code: '\\alpha' },
      { label: 'β', code: '\\beta' },
      { label: 'γ', code: '\\gamma' },
      { label: 'δ', code: '\\delta' },
      { label: 'ε', code: '\\epsilon' },
      { label: 'ζ', code: '\\zeta' },
      { label: 'η', code: '\\eta' },
      { label: 'θ', code: '\\theta' },
      { label: 'ι', code: '\\iota' },
      { label: 'κ', code: '\\kappa' },
      { label: 'λ', code: '\\lambda' },
      { label: 'μ', code: '\\mu' },
      { label: 'ν', code: '\\nu' },
      { label: 'ξ', code: '\\xi' },
      { label: 'π', code: '\\pi' },
      { label: 'ρ', code: '\\rho' },
      { label: 'σ', code: '\\sigma' },
      { label: 'τ', code: '\\tau' },
      { label: 'υ', code: '\\upsilon' },
      { label: 'φ', code: '\\phi' },
      { label: 'χ', code: '\\chi' },
      { label: 'ψ', code: '\\psi' },
      { label: 'ω', code: '\\omega' },
      { label: 'Γ', code: '\\Gamma' },
      { label: 'Δ', code: '\\Delta' },
      { label: 'Θ', code: '\\Theta' },
      { label: 'Λ', code: '\\Lambda' },
      { label: 'Σ', code: '\\Sigma' },
      { label: 'Φ', code: '\\Phi' },
      { label: 'Ψ', code: '\\Psi' },
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
      { label: '∓', code: '\\mp' },
      { label: '·', code: '\\cdot' },
      { label: '∗', code: '\\ast' },
      { label: '⊕', code: '\\oplus' },
      { label: '⊗', code: '\\otimes' },
      { label: '∘', code: '\\circ' },
      { label: '∂', code: '\\partial' },
      { label: '∇', code: '\\nabla' },
      { label: '∞', code: '\\infty' },
      { label: '°', code: '^{\\circ}' },
    ],
  },
  {
    id: 'relations',
    label: 'Relations',
    symbols: [
      { label: '=', code: '=' },
      { label: '≠', code: '\\neq' },
      { label: '≈', code: '\\approx' },
      { label: '≡', code: '\\equiv' },
      { label: '∼', code: '\\sim' },
      { label: '<', code: '<' },
      { label: '>', code: '>' },
      { label: '≤', code: '\\leq' },
      { label: '≥', code: '\\geq' },
      { label: '≪', code: '\\ll' },
      { label: '≫', code: '\\gg' },
      { label: '∝', code: '\\propto' },
      { label: '⊂', code: '\\subset' },
      { label: '⊃', code: '\\supset' },
      { label: '⊆', code: '\\subseteq' },
      { label: '⊇', code: '\\supseteq' },
      { label: '∈', code: '\\in' },
      { label: '∉', code: '\\notin' },
      { label: '∋', code: '\\ni' },
    ],
  },
  {
    id: 'arrows',
    label: 'Arrows',
    symbols: [
      { label: '←', code: '\\leftarrow' },
      { label: '→', code: '\\rightarrow' },
      { label: '↔', code: '\\leftrightarrow' },
      { label: '⇐', code: '\\Leftarrow' },
      { label: '⇒', code: '\\Rightarrow' },
      { label: '⇔', code: '\\Leftrightarrow' },
      { label: '↑', code: '\\uparrow' },
      { label: '↓', code: '\\downarrow' },
      { label: '↦', code: '\\mapsto' },
      { label: '⟶', code: '\\longrightarrow' },
      { label: '⟹', code: '\\Longrightarrow' },
    ],
  },
  {
    id: 'sets',
    label: 'Sets',
    symbols: [
      { label: '∪', code: '\\cup' },
      { label: '∩', code: '\\cap' },
      { label: '∅', code: '\\emptyset' },
      { label: 'ℕ', code: '\\mathbb{N}' },
      { label: 'ℤ', code: '\\mathbb{Z}' },
      { label: 'ℚ', code: '\\mathbb{Q}' },
      { label: 'ℝ', code: '\\mathbb{R}' },
      { label: 'ℂ', code: '\\mathbb{C}' },
      { label: '∀', code: '\\forall' },
      { label: '∃', code: '\\exists' },
      { label: '∄', code: '\\nexists' },
      { label: '¬', code: '\\neg' },
      { label: '∧', code: '\\land' },
      { label: '∨', code: '\\lor' },
    ],
  },
  {
    id: 'matrices',
    label: 'Matrices',
    symbols: [
      { label: '( )', code: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', tooltip: 'Parentheses matrix' },
      { label: '[ ]', code: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}', tooltip: 'Bracket matrix' },
      { label: '{ }', code: '\\begin{Bmatrix} a & b \\\\ c & d \\end{Bmatrix}', tooltip: 'Brace matrix' },
      { label: '| |', code: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}', tooltip: 'Determinant' },
      { label: 'vec', code: '\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}', tooltip: 'Column vector' },
      { label: 'cases', code: '\\begin{cases} x & \\text{if } x > 0 \\\\ -x & \\text{if } x \\leq 0 \\end{cases}', tooltip: 'Cases' },
    ],
  },
  {
    id: 'accents',
    label: 'Accents',
    symbols: [
      { label: 'x̄', code: '\\bar{x}' },
      { label: 'x̂', code: '\\hat{x}' },
      { label: 'x̃', code: '\\tilde{x}' },
      { label: 'x⃗', code: '\\vec{x}' },
      { label: 'ẋ', code: '\\dot{x}' },
      { label: 'ẍ', code: '\\ddot{x}' },
      { label: 'x\'', code: "x'" },
      { label: 'x\'\'', code: "x''" },
    ],
  },
];

export function SymbolPalette({ onInsert }: SymbolPaletteProps) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0].id);
  const { t } = useLanguageStore();

  const activeSymbols =
    categories.find((category) => category.id === activeCategory)?.symbols ?? [];

  return (
    <div className="border-b border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/50">
      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto px-2 pt-2 pb-1 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={category.id === activeCategory ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className="shrink-0 h-7 px-2.5 text-xs font-medium"
          >
            {t.latex.categories[category.id as keyof typeof t.latex.categories]}
          </Button>
        ))}
      </div>

      {/* Symbol grid */}
      <div className="flex flex-wrap gap-1 p-2 max-h-24 overflow-y-auto">
        {activeSymbols.map((item, index) => (
          <Button
            key={`${item.code}-${index}`}
            variant="outline"
            size="sm"
            onClick={() => onInsert(item.code)}
            className="h-8 min-w-[2rem] px-2 text-base font-serif hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950/30 dark:hover:border-purple-700"
            title={item.tooltip || item.code}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* Quick tips */}
      <div className="px-2 pb-2 text-[10px] text-neutral-400 dark:text-neutral-500">
        <span dangerouslySetInnerHTML={{ __html: t.latex.tip.replace(/\$\$(.*?)\$\$/g, '<code class="bg-neutral-200 dark:bg-neutral-700 px-1 rounded">$$$1$$</code>').replace(/\$(.*?)\$/g, '<code class="bg-neutral-200 dark:bg-neutral-700 px-1 rounded">$$$1$$</code>') }} />
      </div>
    </div>
  );
}
