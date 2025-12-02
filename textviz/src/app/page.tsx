"use client";

import { Header } from '@/components/layout/Header';
import { NavigationCard } from '@/components/ui/NavigationCard';
import { FileText, Sigma, GitGraph, Braces } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="container py-12 md:py-24 lg:py-32">
        {/* Hero Section */}
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            Visualize Your Text <br className="hidden sm:inline" />
            Instantly & Beautifully
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            A unified platform for Markdown documentation, LaTeX typesetting, Mermaid diagrams, and AI prompt engineering.
          </p>
        </div>

        {/* Navigation Cards Grid */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <NavigationCard
            title="Markdown Editor"
            description="Write documentation with GFM support and real-time preview."
            href="/markdown"
            icon={FileText}
            color="text-blue-500"
          />
          <NavigationCard
            title="LaTeX Studio"
            description="Typeset papers and math formulas with professional precision."
            href="/latex"
            icon={Sigma}
            color="text-green-500"
          />
          <NavigationCard
            title="Mermaid Live"
            description="Create flowcharts and diagrams using simple text syntax."
            href="/mermaid"
            icon={GitGraph}
            color="text-purple-500"
          />
          <NavigationCard
            title="Prompt Builder"
            description="Construct complex AI prompts with a block-based JSON builder."
            href="/json-builder"
            icon={Braces}
            color="text-orange-500"
          />
        </div>

        {/* Recent Files (Placeholder for now) */}
        <div className="mx-auto mt-24 max-w-3xl">
           <div className="flex items-center justify-between border-b pb-4">
             <h2 className="text-2xl font-bold tracking-tight">Recent Works</h2>
             <span className="text-sm text-muted-foreground">Local storage based</span>
           </div>
           <div className="mt-8 text-center text-muted-foreground py-12 border border-dashed rounded-lg">
             <p>No recent files found. Start creating!</p>
           </div>
        </div>
      </main>
    </div>
  );
}