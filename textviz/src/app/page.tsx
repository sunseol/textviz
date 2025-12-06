"use client";

import { useLanguageStore } from '@/store/useLanguageStore';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component, if not I'll use raw generic button or check components.
// Checking recent files component usage? Maybe remove it for main landing or keep at bottom? User said "CTA focused". I'll keep it at bottom as "Jump back in".
import { RecentFiles } from '@/components/home/RecentFiles';
import Link from 'next/link';
import Image from 'next/image';
// I'll stick to standard Tailwind transitions to be safe, or check package.json first.
// I'll check package.json for framer-motion.
// Actually, I'll just use standard CSS animations for now to avoid dependency issues unless I know it's there.
// User demanded "high wow factor", "modern visual".
// I'll use safe Tailwind animate-in.

export default function Home() {
  const { t } = useLanguageStore();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans antialiased selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100">
      <Header />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="relative px-4 pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
          <div className="container mx-auto max-w-5xl text-center relative z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white whitespace-pre-line leading-[1.15] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {t.home.title}
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              {t.home.subtitle}
            </p>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link href="/markdown">
                <button className="rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 hover:shadow-blue-500/25">
                  {t.home.getStarted}
                </button>
              </Link>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-40 dark:opacity-20 pointer-events-none">
            <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-[128px]" />
            <div className="absolute top-[30%] right-[20%] w-72 h-72 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-[128px]" />
          </div>
        </section>

        {/* Feature: Markdown */}
        <section className="py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative rounded-xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900">
                {/* Image Placeholder - relying on generated images */}
                <Image
                  src="/images/landing/markdown-preview.png"
                  alt="Markdown Editor"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="order-1 md:order-2 space-y-4 md:pl-10">
                <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-2">
                  {/* Icon match */}
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">Markdown</span>
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">{t.home.features.markdown.title}</h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {t.home.features.markdown.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature: LaTeX (Reversed) */}
        <section className="py-20 md:py-32 bg-white dark:bg-neutral-950">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4 md:pr-10">
                <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mb-2">
                  <span className="text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-wider">LaTeX</span>
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">{t.home.features.latex.title}</h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {t.home.features.latex.description}
                </p>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900">
                <Image
                  src="/images/landing/latex-editor.png"
                  alt="LaTeX Editor"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Feature: Mermaid */}
        <section className="py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative rounded-xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900">
                <Image
                  src="/images/landing/mermaid-diagram.png"
                  alt="Mermaid Diagrams"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="order-1 md:order-2 space-y-4 md:pl-10">
                <div className="inline-flex items-center justify-center p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">Mermaid</span>
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">{t.home.features.mermaid.title}</h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {t.home.features.mermaid.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature: JSON (Reversed) */}
        <section className="py-20 md:py-32 bg-white dark:bg-neutral-950">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4 md:pr-10">
                <div className="inline-flex items-center justify-center p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg mb-2">
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider">JSON</span>
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">{t.home.features.jsonBuilder.title}</h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {t.home.features.jsonBuilder.description}
                </p>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900">
                <Image
                  src="/images/landing/json-builder.png"
                  alt="JSON Builder"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA / Recent Files */}
        <section className="py-24 border-t border-neutral-100 dark:border-neutral-800">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white">Run your ideas.</h2>
            <Link href="/markdown">
              <button className="rounded-full bg-neutral-900 dark:bg-white px-8 py-4 text-sm font-semibold text-white dark:text-neutral-900 shadow-lg transition-all hover:scale-105 active:scale-95">
                {t.home.getStarted}
              </button>
            </Link>

            <div className="mt-20 text-left">
              <RecentFiles />
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
