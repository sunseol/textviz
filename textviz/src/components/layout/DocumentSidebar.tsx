"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FileText, GitGraph, Sigma } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import { useMarkdownStore } from "@/store/useMarkdownStore";
import { useLatexStore } from "@/store/useLatexStore";
import { useMermaidStore } from "@/store/useMermaidStore";
import { cn } from "@/lib/utils";

type DocKind = "markdown" | "latex" | "mermaid";

interface DocumentSidebarProps {
  active: DocKind;
}

const gradients: Record<DocKind, string> = {
  markdown: "from-blue-500/80 via-cyan-400/80 to-indigo-500/80",
  latex: "from-emerald-500/80 via-teal-400/80 to-green-500/80",
  mermaid: "from-purple-500/80 via-fuchsia-400/80 to-indigo-500/80",
};

const iconMap: Record<DocKind, typeof FileText> = {
  markdown: FileText,
  latex: Sigma,
  mermaid: GitGraph,
};

function trimContent(raw: string, maxChars = 420) {
  if (!raw?.trim()) return "No content yet.";
  const normalized = raw.replace(/\s+/g, " ").trim();
  return normalized.length > maxChars
    ? `${normalized.slice(0, maxChars)}…`
    : normalized;
}

function MarkdownPeek({ content }: { content: string }) {
  const preview = useMemo(() => trimContent(content), [content]);
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {preview}
      </ReactMarkdown>
    </div>
  );
}

function PlainPeek({ content }: { content: string }) {
  const preview = trimContent(content);
  return (
    <p className="text-[12px] leading-5 text-muted-foreground font-mono whitespace-pre-wrap">
      {preview}
    </p>
  );
}

export function DocumentSidebar({ active }: DocumentSidebarProps) {
  const [mounted, setMounted] = useState(false);
  const markdown = useMarkdownStore((state) => state.markdown);
  const latex = useLatexStore((state) => state.latex);
  const mermaid = useMermaidStore((state) => state.mermaidCode);

  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <aside className="h-full rounded-2xl border border-white/40 bg-white/60 dark:border-white/10 dark:bg-neutral-950/50 backdrop-blur-xl" />
    );
  }

  const docs: { id: DocKind; title: string; href: string; content: string }[] = [
    { id: "markdown", title: "Markdown", href: "/markdown", content: markdown },
    { id: "latex", title: "LaTeX", href: "/latex", content: latex },
    { id: "mermaid", title: "Mermaid", href: "/mermaid", content: mermaid },
  ];

  return (
    <aside className="flex h-full flex-col gap-4 rounded-2xl border border-white/40 bg-white/70 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-950/60">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Documents
        </span>
        <span className="text-[11px] text-muted-foreground/80">Preview</span>
      </div>
      <div className="space-y-3 overflow-auto pr-1">
        {docs.map((doc) => {
          const Icon = iconMap[doc.id];
          return (
            <Link
              key={doc.id}
              href={doc.href}
            className={cn(
              "group block rounded-2xl border border-white/40 bg-white/80 p-3 backdrop-blur-xl transition-all duration-150 dark:border-white/10 dark:bg-neutral-950/70",
              "shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)]",
              active === doc.id && "ring-2 ring-offset-2 ring-offset-transparent ring-violet-400/70 dark:ring-violet-500/70"
            )}
          >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-inner",
                    `bg-gradient-to-br ${gradients[doc.id]}`
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>{doc.title}</span>
                    <span className="text-[11px] font-medium text-muted-foreground">Draft</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Autosaved</p>
                </div>
              </div>
              <div className="relative mt-3 max-h-36 overflow-hidden rounded-xl border border-white/40 bg-muted/40 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                {doc.id === "mermaid" ? (
                  <PlainPeek content={doc.content} />
                ) : (
                  <MarkdownPeek content={doc.content} />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/95 via-background/70 to-transparent dark:from-neutral-950/95 dark:via-neutral-950/60" />
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
