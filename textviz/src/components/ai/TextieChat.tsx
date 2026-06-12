'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import type { Message } from 'ai';
import { useRouter, usePathname } from 'next/navigation';
import { useTextieStore } from '@/store/useTextieStore';
import { useDocumentStore, DocumentType } from '@/store/useDocumentStore';
import { Send, Paperclip } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { Button } from '@/components/ui/button';
import { useChatHistoryStore } from '@/store/useChatHistoryStore';
import { ChatHistoryModal } from './ChatHistoryModal';
import { TextieLauncher } from './TextieLauncher';
import { TextiePanelHeader } from './TextiePanelHeader';
import { TextieEmptyState } from './TextieEmptyState';
import { TextieTypingIndicator } from './TextieTypingIndicator';
import { inferDocumentTypeFromPrompt, parseNavigateAction } from './textieActions';

export function TextieChat() {
    const router = useRouter();
    const pathname = usePathname();
    const { isOpen, toggleOpen, userProfile } = useTextieStore();
    const { getActiveDocument } = useDocumentStore();
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
                append({ role: 'user', content: pendingAction.prompt });
                queueMicrotask(() => setPendingAction(null));
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
        if (messages.length > 0) {
            addSession(messages); // Save current session
        }
        setMessages([]); // Clear chat
        setInput('');
        if (inputRef.current) inputRef.current.focus();
    };

    const handleRestore = (restoredMessages: Message[]) => {
        setMessages(restoredMessages);
        setHistoryOpen(false);
    };

    const handleSend = async (e: React.FormEvent) => {
        const isLandingPage = pathname === '/';
        const currentInput = input;

        // If user is manually typing on landing page, suggest navigation
        if (isLandingPage && !activeDoc) {
            e.preventDefault();

            const type = inferDocumentTypeFromPrompt(currentInput);
            setInput(''); // Clear input manually

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
        return <TextieLauncher onOpen={toggleOpen} />;
    }

    return (
        <div ref={chatContainerRef} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex w-[90vw] max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white/95 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-8 dark:border-neutral-800 dark:bg-neutral-900/95">
            <TextiePanelHeader
                activeDoc={activeDoc}
                historyOpen={historyOpen}
                onToggleHistory={() => setHistoryOpen(!historyOpen)}
                onNewChat={handleNewChat}
                onClose={toggleOpen}
            />

            <div className="flex-1 overflow-y-auto p-4 min-h-[300px] max-h-[60vh] bg-neutral-50/50 dark:bg-neutral-950/50 scrollbar-thin">
                {messages.length === 0 ? (
                    <TextieEmptyState onQuickAction={handleQuickAction} />
                ) : (
                    messages.map((m: Message) => (
                        <ChatMessage
                            key={m.id}
                            role={m.role}
                            content={m.content}
                            activeDocType={effectiveType}
                            onAction={async (action, content) => {
                                const currentStore = useDocumentStore.getState();
                                const currentActiveDoc = currentStore.getActiveDocument();

                                if (action === 'navigate') {
                                    const payload = parseNavigateAction(content);
                                    if (!payload) {
                                        return;
                                    }
                                    const newDoc = await currentStore.addDocument(payload.type);
                                    if (newDoc) {
                                        if (payload.prompt) {
                                            setPendingAction({ prompt: payload.prompt, targetType: payload.type });
                                        }
                                        router.push(`/${payload.type}`);
                                    }
                                }
                                if (action === 'insert') {
                                    if (currentActiveDoc?.id) {
                                        currentStore.updateDocument(currentActiveDoc.id, {
                                            content: content
                                        });
                                    }
                                }
                            }}
                        />
                    ))
                )}
                {isLoading && <TextieTypingIndicator />}
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
