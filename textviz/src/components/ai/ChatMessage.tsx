import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import 'katex/dist/katex.min.css';
import type { Message } from 'ai';
import type { DocumentType } from '@/store/useDocumentStore';

interface ChatMessageProps {
    role: Message['role'];
    content: string;
    onAction?: (action: 'copy' | 'insert' | 'navigate', content: string) => void;
    activeDocType?: DocumentType;
}

type NavSuggestionPayload = {
    readonly prompt: string;
    readonly type: DocumentType;
};

type MarkdownCodeProps = React.HTMLAttributes<HTMLElement> & {
    readonly inline?: boolean;
    readonly node?: unknown;
};

const languageToDocumentType: Record<string, DocumentType> = {
    mermaid: 'mermaid',
    markdown: 'markdown',
    md: 'markdown',
    latex: 'latex',
    tex: 'latex',
    json: 'json-builder',
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDocumentType(value: unknown): value is DocumentType {
    return value === 'markdown' || value === 'latex' || value === 'mermaid' || value === 'json-builder';
}

function parseNavSuggestion(content: string): NavSuggestionPayload | null {
    if (!content.startsWith('[NAV_SUGGESTION]')) {
        return null;
    }

    try {
        const parsed: unknown = JSON.parse(content.replace('[NAV_SUGGESTION]', ''));
        if (!isRecord(parsed) || !isDocumentType(parsed.type) || typeof parsed.prompt !== 'string') {
            return null;
        }

        return {
            prompt: parsed.prompt,
            type: parsed.type,
        };
    } catch {
        return null;
    }
}

export function ChatMessage({ role, content, onAction, activeDocType }: ChatMessageProps) {
    const isUser = role === 'user';

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    const navSuggestion = parseNavSuggestion(content);

    if (navSuggestion) {
        const { prompt, type } = navSuggestion;

        return (
            <div className="flex w-full gap-3 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-100 shadow-sm dark:border-blue-800 dark:bg-blue-900/30">
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex flex-col gap-3 rounded-2xl rounded-tl-none border border-neutral-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        그 작업을 수행하려면 <strong>{type === 'mermaid' ? '다이어그램' : '마크다운'}</strong> 에디터로 이동해야 합니다.
                    </p>
                    <button
                        onClick={() => onAction?.('navigate', JSON.stringify({ type, prompt }))}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/20 active:scale-[0.98]"
                    >
                        에디터로 이동하여 시작하기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex w-full gap-3 p-4", isUser ? "flex-row-reverse" : "flex-row")}>
            <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm",
                isUser ? "bg-white dark:bg-neutral-800" : "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
            )}>
                {isUser ? <User className="h-4 w-4 text-neutral-600 dark:text-neutral-400" /> : <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
            </div>

            <div className={cn(
                // Added min-w-0 to ensure flex item can shrink below content size if needed
                "relative max-w-[85%] min-w-0 rounded-2xl px-4 py-3 text-sm shadow-sm prose prose-sm max-w-none break-words dark:prose-invert",
                isUser
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-tr-none prose-invert dark:prose-neutral"
                    : "bg-white border border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 rounded-tl-none"
            )}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                        // Unwrap pre to prevent default browser styling from forcing width
                        pre: ({ children }) => <>{children}</>,
                        p: ({ node, ...props }) => {
                            void node;
                            return <p className="mb-2 last:mb-0 break-words whitespace-pre-wrap" {...props} />;
                        },
                        a: ({ node, ...props }) => {
                            void node;
                            return <a className="text-blue-500 hover:underline" {...props} />;
                        },
                        code: ({ node, inline, className, children, ...props }: MarkdownCodeProps) => {
                            void node;
                            const match = /language-(\w+)/.exec(className || '');
                            const language = match ? match[1] : '';
                            const codeContent = String(children).replace(/\n$/, '');

                            const targetType = languageToDocumentType[language];

                            // Action Logic
                            const isContextMatch = activeDocType === targetType;
                            const canInsert = ['python', 'javascript', 'typescript', 'tsx', 'jsx', 'html', 'css', 'bash', 'shell'].includes(language) || isContextMatch;
                            const canNavigate = !isContextMatch && targetType && language !== '';

                            // Use !inline to determine block mode
                            // This covers triple backticks and indented blocks
                            const isBlock = !inline;

                            return isBlock ? (
                                <div className="my-2 w-full max-w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
                                    <div className="flex items-center justify-between bg-neutral-100 px-3 py-1.5 dark:bg-neutral-800">
                                        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">{language || 'CODE'}</span>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(codeContent)}
                                                className="text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                                            >
                                                Copy
                                            </button>

                                            {/* Smart Action Buttons */}
                                            {!isUser && onAction && (
                                                <>
                                                    {canNavigate && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onAction('navigate', JSON.stringify({ type: targetType, prompt: '' }))}
                                                            className="text-[10px] font-bold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                                        >
                                                            Go to Editor
                                                        </button>
                                                    )}
                                                    {canInsert && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onAction('insert', codeContent)}
                                                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                        >
                                                            Insert
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {/* Wrapper for code to allow scroll */}
                                    <div className="w-full overflow-x-auto bg-neutral-50 p-3 dark:bg-neutral-900">
                                        <code className={cn("block min-w-max text-xs font-mono", className)} {...props}>
                                            {children}
                                        </code>
                                    </div>
                                </div>
                            ) : (
                                <code className="rounded bg-neutral-200/50 px-1 py-0.5 text-xs font-mono dark:bg-neutral-700/50" {...props}>
                                    {children}
                                </code>
                            );
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div >
    );
}
