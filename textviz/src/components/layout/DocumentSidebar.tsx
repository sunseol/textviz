"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, GitGraph, Sigma, Plus, ChevronRight } from "lucide-react";

import { useMarkdownStore } from "@/store/useMarkdownStore";
import { useLatexStore } from "@/store/useLatexStore";
import { useMermaidStore } from "@/store/useMermaidStore";
import { cn } from "@/lib/utils";

type DocKind = "markdown" | "latex" | "mermaid";

interface DocumentSidebarProps {
  active: DocKind;
}

const docConfig: Record<DocKind, { 
  icon: typeof FileText; 
  color: string; 
  bgColor: string;
  label: string;
}> = {
  markdown: { 
    icon: FileText, 
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    label: "MD"
  },
  latex: { 
    icon: Sigma, 
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    label: "TEX"
  },
  mermaid: { 
    icon: GitGraph, 
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
    label: "MMD"
  },
};

function getPreview(content: string, maxLength = 60): string {
  if (!content?.trim()) return "Empty document";
  const cleaned = content.replace(/[#*`>\-\[\]()]/g, '').replace(/\s+/g, ' ').trim();
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength) + '...' : cleaned;
}

function getWordCount(content: string): number {
  if (!content?.trim()) return 0;
  return content.trim().split(/\s+/).length;
}

export function DocumentSidebar({ active }: DocumentSidebarProps) {
  const [mounted, setMounted] = useState(false);
  const markdown = useMarkdownStore((state) => state.markdown);
  const latex = useLatexStore((state) => state.latex);
  const mermaid = useMermaidStore((state) => state.mermaidCode);

  useEffect(() => setMounted(true), []);
  
  if (!mounted) {
    return (
      <aside className="h-full rounded-xl bg-white dark:bg-neutral-900" />
    );
  }

  const docs: { id: DocKind; title: string; href: string; content: string }[] = [
    { id: "markdown", title: "Markdown", href: "/markdown", content: markdown },
    { id: "latex", title: "LaTeX", href: "/latex", content: latex },
    { id: "mermaid", title: "Mermaid", href: "/mermaid", content: mermaid },
  ];

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Documents
        </h2>
        <button className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      {/* Document List */}
      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-1">
          {docs.map((doc) => {
            const config = docConfig[doc.id];
            const Icon = config.icon;
            const isActive = active === doc.id;
            const wordCount = getWordCount(doc.content);
            const preview = getPreview(doc.content);
            
            return (
              <Link
                key={doc.id}
                href={doc.href}
                className={cn(
                  "group flex flex-col gap-2 rounded-lg p-3 transition-all duration-150",
                  isActive 
                    ? "bg-neutral-100 dark:bg-neutral-800" 
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                )}
              >
                {/* Top Row */}
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    config.bgColor
                  )}>
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn(
                        "text-sm font-medium truncate",
                        isActive ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-300"
                      )}>
                        {doc.title}
                      </span>
                      <ChevronRight className={cn(
                        "h-4 w-4 shrink-0 transition-transform",
                        isActive ? "text-neutral-400" : "text-neutral-300 dark:text-neutral-600",
                        "group-hover:translate-x-0.5"
                      )} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
                        {wordCount} words
                      </span>
                      <span className="text-neutral-300 dark:text-neutral-700">·</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                        Draft
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Preview */}
                <p className={cn(
                  "text-xs leading-relaxed line-clamp-2 pl-11",
                  isActive ? "text-neutral-600 dark:text-neutral-400" : "text-neutral-500 dark:text-neutral-500"
                )}>
                  {preview}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-neutral-100 px-4 py-3 dark:border-neutral-800">
        <div className="flex items-center justify-between text-[10px] text-neutral-400">
          <span>3 documents</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Synced
          </span>
        </div>
      </div>
    </aside>
  );
}
