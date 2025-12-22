import React from 'react';
import { useChatHistoryStore, ChatSession } from '@/store/useChatHistoryStore';
import { Message } from 'ai';
import { Button } from '@/components/ui/button';
import { Trash2, MessageSquare, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/store/useLanguageStore';

interface ChatHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRestore: (messages: Message[]) => void;
}

export function ChatHistoryModal({ isOpen, onClose, onRestore }: ChatHistoryModalProps) {
    const { sessions, deleteSession, clearHistory } = useChatHistoryStore();
    const { t } = useLanguageStore();

    if (!isOpen) return null;

    const handleRestore = (session: ChatSession) => {
        onRestore(session.messages);
        onClose();
    };

    return (
        <div className="absolute inset-0 z-50 flex flex-col bg-white/95 backdrop-blur-sm dark:bg-neutral-900/95 animate-in fade-in zoom-in-95 duration-200 rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-neutral-500" />
                    <h3 className="font-semibold text-neutral-900 dark:text-white">Chat History</h3>
                </div>
                <div className="flex items-center gap-1">
                    {sessions.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearHistory}
                            className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                            Clear All
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                {sessions.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-neutral-500 gap-2">
                        <MessageSquare className="h-8 w-8 opacity-20" />
                        <p className="text-sm">No history yet</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className="group flex items-center justify-between rounded-lg border border-neutral-100 bg-white p-3 shadow-sm hover:border-blue-200 hover:shadow-md transition-all dark:border-neutral-800 dark:bg-neutral-800 dark:hover:border-blue-800 cursor-pointer"
                                onClick={() => handleRestore(session)}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700">
                                        <MessageSquare className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                    </div>
                                    <div className="flex flex-col overflow-hidden text-left">
                                        <span className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                                            {session.title}
                                        </span>
                                        <span className="text-xs text-neutral-400">
                                            {new Date(session.timestamp).toLocaleString()} · {session.messages.length} msgs
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSession(session.id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
