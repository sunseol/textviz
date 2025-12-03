"use client";

import { useLanguageStore } from '@/store/useLanguageStore';

import { Header } from '@/components/layout/Header';

import { NavigationCard } from '@/components/ui/NavigationCard';

import { RecentFiles } from '@/components/home/RecentFiles';

import { FileText, Sigma, GitGraph, Braces } from 'lucide-react';



export default function Home() {
  const { t } = useLanguageStore();

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-12 md:py-24 lg:py-32">
        {/* Hero Section */}
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            {t.home.title}
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            {t.home.subtitle}
          </p>
        </div>

        {/* Navigation Cards Grid */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <NavigationCard
            title={t.home.features.markdown.title}
            description={t.home.features.markdown.description}
            href="/markdown"
            icon={FileText}
            color="text-blue-500"
          />
          <NavigationCard
            title={t.home.features.latex.title}
            description={t.home.features.latex.description}
            href="/latex"
            icon={Sigma}
            color="text-green-500"
          />
          <NavigationCard
            title={t.home.features.mermaid.title}
            description={t.home.features.mermaid.description}
            href="/mermaid"
            icon={GitGraph}
            color="text-purple-500"
          />
          <NavigationCard
            title={t.home.features.jsonBuilder.title}
            description={t.home.features.jsonBuilder.description}
            href="/json-builder"
            icon={Braces}
            color="text-orange-500"
          />
        </div>



        {/* Recent Files */}

        <div className="mx-auto mt-24 max-w-5xl">

          <RecentFiles />

        </div>

      </main>

    </div>

  );

}
