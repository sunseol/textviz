'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Message } from 'ai';
import { useRouter, usePathname } from 'next/navigation';
import { useTextieStore } from '@/store/useTextieStore';
import { useDocumentStore, DocumentType } from '@/store/useDocumentStore';
import { cn } from '@/lib/utils';
import { Bot, X, Send, Sparkles, Plus, Clock, Paperclip } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useChatHistoryStore } from '@/store/useChatHistoryStore';
import { ChatHistoryModal } from './ChatHistoryModal';

export function TextieChat() {
    const router = useRouter();
    const pathname = usePathname();
    const { isOpen, toggleOpen, userProfile } = useTextieStore();
    const { activeDocumentId, getActiveDocument, updateDocument, addDocument } = useDocumentStore();
    const { t } = useLanguageStore();
    const { addSession } = useChatHistoryStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [pendingAction, setPendingAction] = React.useState<{ prompt: string, targetType: DocumentType } | null>(null);
    const [historyOpen, setHistoryOpen] = React.useState(false);

    // Collect Context for the API
    const isLandingPage = pathname === '/';
    // CRITICAL FIX: Ghost Context Prevention
    // If on landing page, we MUST ignore the global activeDocument, otherwise Textie thinks we are editing it.
    const rawActiveDoc = getActiveDocument();
    const activeDoc = isLandingPage ? null : rawActiveDoc;

    // Infer type from pathname if activeDoc is missing (e.g. /mermaid -> mermaid)
    // accessible paths: /markdown, /mermaid, /latex, /json-builder
    const pathType = pathname.split('/')[1] as DocumentType | undefined;
    const effectiveType = activeDoc?.type || (['markdown', 'mermaid', 'latex', 'json'].includes(pathType || '') ? pathType : undefined);

    const currentContext = {
        docId: activeDoc?.id,
        docTitle: activeDoc?.title,
        docType: effectiveType,
        contentPreview: activeDoc?.content?.slice(0, 5000) || '',
        cursorPosition: 0,
    };

    const { messages, input, handleInputChange, handleSubmit, isLoading, append, setInput, setMessages } = useChat({
        api: '/api/chat',
        body: {
            userProfile,
            currentContext,
        },
    });

    // Execute pending action when context is ready
    useEffect(() => {
        if (pendingAction) {
            // Check if we have arrived at the correct context
            // effectiveType is derived from activeDoc OR pathname (from previous fix)
            const isContextReady = effectiveType === pendingAction.targetType;

            if (isContextReady) {
                console.log('[TextieChat] Context ready. Executing pending prompt:', pendingAction.prompt);
                append({ role: 'user', content: pendingAction.prompt });
                setPendingAction(null); // Clear pending action
            }
        }
    }, [effectiveType, pendingAction, append]);

    const handleQuickAction = async (prompt: string, type: DocumentType = 'markdown') => {
        const isLandingPage = pathname === '/';

        if (!activeDoc || isLandingPage) {
            // For quick actions, we want the same "Navigate Suggestion" behavior if on landing page
            // Simulate specific message
            append({
                id: Date.now().toString(),
                role: 'assistant',
                content: `[NAV_SUGGESTION]${JSON.stringify({ type, prompt })}`
            });
        } else {
            append({ role: 'user', content: prompt });
        }
    };

    const handleNewChat = () => {
        console.log('[TextieChat] New Chat Clicked. Msgs:', messages.length);
        if (messages.length > 0) {
            addSession(messages); // Save current session
        }
        setMessages([]); // Clear chat
        setInput('');
        if (inputRef.current) inputRef.current.focus();
    };

    const handleRestore = (restoredMessages: any[]) => {
        setMessages(restoredMessages);
        setHistoryOpen(false);
    };

    const handleSend = async (e: React.FormEvent) => {
        const isLandingPage = pathname === '/';
        const currentInput = input;

        // If user is manually typing on landing page, suggest navigation
        if (isLandingPage && !activeDoc) {
            e.preventDefault();

            // Analyze intent
            const lowerInput = currentInput.toLowerCase();
            const isMermaid = ['다이어그램', '차트', '시퀀스', '플로우', 'diagram', 'chart', 'graph', 'mermaid'].some(k => lowerInput.includes(k));
            const isLatex = ['라텍스', '수식', 'latex', 'tex', 'math', 'formula', 'equation'].some(k => lowerInput.includes(k));

            let type: DocumentType = 'markdown';
            if (isMermaid) type = 'mermaid';
            else if (isLatex) type = 'latex';
            else if (lowerInput.includes('json')) type = 'json-builder';

            // Append assistant message with navigation suggestion
            // We can manually set input to empty string using setInput if not cleared automatically
            // But preventing default wrapper means useChat won't clear input.
            setInput(''); // Clear input manually

            // Append user message manually to show history?
            // append({ role: 'user', content: currentInput });
            // Wait, append returns a promise. We should chain them?
            // Actually append adds ONE message to the end.
            // If we want both User and Assistant messages to appear without hitting API, useChat doesn't easily support adding two messages at once locally.
            // Workaround: Add Assistant message directly. The user message won't be in history but that's okay for "pre-start" checks?
            // OR: We append the NAV_SUGGESTION. The prompt is encoded in it.
            append({
                id: Date.now().toString(),
                role: 'assistant',
                content: `[NAV_SUGGESTION]${JSON.stringify({ type, prompt: currentInput })}`
            });

            return;
        }

        handleSubmit(e);
    };

    // Scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            // Use 'auto' (instant) scrolling during streaming (isLoading) to prevent jitter/jank
            // Use 'smooth' only when a full message arrives or user interaction happens (optional)
            // Ideally, just 'auto' is best for chat streaming feeling "snappy" and "smooth" in terms of performance
            messagesEndRef.current.scrollIntoView({ behavior: isLoading ? 'auto' : 'smooth' });
        }
    }, [messages, isLoading]);

    // Focus input on open or navigation
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 300);
        }
    }, [isOpen, pathname]);

    // Click outside to minimize
    const chatContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
                // Check if the click target is inside a portal (like a tooltip or modal that might be rendered outside)
                // For now, simpler check is sufficient as History Modal is inside.
                toggleOpen();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, toggleOpen]);

    // Global Keyboard Shortcut: Ctrl + \ (Backslash)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
                e.preventDefault();
                toggleOpen();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleOpen]);

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
                <button
                    onClick={toggleOpen}
                    className="group flex items-center gap-3 rounded-full bg-neutral-900 pr-6 pl-2 py-2 text-white shadow-2xl transition-all hover:-translate-y-1 hover:shadow-neutral-900/20 active:translate-y-0 dark:bg-white dark:text-neutral-900 dark:hover:shadow-white/10"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                        <Bot className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-semibold">
                        Textie에게 물어보세요
                    </span>
                    <div className="flex items-center gap-1 text-xs text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-neutral-500">
                        <span className="bg-neutral-800 dark:bg-neutral-200 px-1.5 py-0.5 rounded">Ctrl + \</span>
                    </div>
                </button>
            </div>
        );
    }

    return (
        <div ref={chatContainerRef} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex w-[90vw] max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white/95 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-8 dark:border-neutral-800 dark:bg-neutral-900/95">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 bg-white/50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50 relative">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 shadow-sm">
                        <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">Textie</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">Online · {activeDoc ? `Observing ${activeDoc.title}` : 'Idle (Landing)'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        onClick={() => setHistoryOpen(!historyOpen)}
                        title="History"
                    >
                        <Clock className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        onClick={handleNewChat}
                        title="New Chat"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30" onClick={toggleOpen}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 min-h-[300px] max-h-[60vh] bg-neutral-50/50 dark:bg-neutral-950/50 scrollbar-thin">
                {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-neutral-500">
                        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-200/50 dark:bg-neutral-800 dark:ring-neutral-700/50">
                            <Sparkles className="h-8 w-8 text-amber-400" />
                        </div>
                        <div className="max-w-xs space-y-1">
                            <p className="font-medium text-neutral-900 dark:text-white">무엇을 도와드릴까요?</p>
                            <p className="text-sm">문서 요약, 다이어그램 생성, 수식 변환 등 {'\n'}필요한 작업을 말씀해주세요.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                                onClick={() => handleQuickAction('이 문서 시놉시스 써줘', 'markdown')}
                                className="rounded-lg border bg-white px-3 py-2 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                            >
                                📝 글쓰기/요약
                            </button>
                            <button
                                onClick={() => handleQuickAction('다이어그램 그려줘', 'mermaid')}
                                className="rounded-lg border bg-white px-3 py-2 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                            >
                                🎨 다이어그램
                            </button>
                        </div>
                    </div>
                ) : (
                    messages.map((m: Message) => (
                        <ChatMessage
                            key={m.id}
                            role={m.role as any}
                            content={m.content}
                            activeDocType={effectiveType}


                            // ... inside return ...
                            // ... inside return ...
                            onAction={async (action, content) => {
                                // Use direct store access to avoid stale closures
                                const currentStore = useDocumentStore.getState();
                                const currentActiveDoc = currentStore.getActiveDocument();

                                console.log('[TextieChat] onAction called:', action, 'ActiveDoc:', currentActiveDoc?.title);

                                if (action === 'navigate') {
                                    try {
                                        // content here is JSON string of {type, prompt}
                                        const { type, prompt } = JSON.parse(content);
                                        const newDoc = await currentStore.addDocument(type);
                                        if (newDoc) {
                                            // Set pending action FIRST only if prompt exists
                                            if (prompt) {
                                                setPendingAction({ prompt, targetType: type });
                                            }
                                            // Then navigate
                                            console.log('[TextieChat] Navigating to:', `/${type}`);
                                            router.push(`/${type}`);
                                        }
                                    } catch (e) {
                                        console.error('[TextieChat] Navigation Failed:', e);
                                    }
                                }
                                if (action === 'insert') {
                                    if (currentActiveDoc?.id) {
                                        console.log('[TextieChat] Overwriting document:', currentActiveDoc.id);
                                        // Overwrite content as requested
                                        currentStore.updateDocument(currentActiveDoc.id, {
                                            content: content
                                        });
                                    } else {
                                        console.warn('[TextieChat] Cannot insert: No active document found.');
                                    }
                                }
                            }}
                        />
                    ))
                )}
                {isLoading && (
                    <div className="flex gap-3 p-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-neutral-900">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 delay-0"></span>
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 delay-150"></span>
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 delay-300"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-neutral-100 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
                <form onSubmit={handleSend} className="relative flex items-center gap-2">
                    <Button type="button" size="icon" variant="ghost" className="shrink-0 text-neutral-400 hover:text-neutral-600">
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    <input
                        ref={inputRef}
                        className="flex-1 bg-transparent px-2 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none dark:text-white"
                        placeholder="Textie에게 메시지 보내기..."
                        value={input}
                        onChange={handleInputChange}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="shrink-0 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        disabled={isLoading || !input.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
                <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-neutral-400">
                    <span>Powered by Groq</span>
                    <span>·</span>
                    <span>Context Aware</span>
                </div>
            </div>

            {/* History Modal Overlay - Full Cover */}
            <ChatHistoryModal
                isOpen={historyOpen}
                onClose={() => setHistoryOpen(false)}
                onRestore={handleRestore}
            />
        </div>
    );
}
