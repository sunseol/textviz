import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from 'ai';

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    timestamp: number;
}

interface ChatHistoryState {
    sessions: ChatSession[];
    addSession: (messages: Message[], title?: string) => void;
    deleteSession: (id: string) => void;
    clearHistory: () => void;
}

export const useChatHistoryStore = create<ChatHistoryState>()(
    persist(
        (set) => ({
            sessions: [],
            addSession: (messages, title) => {
                if (!messages || messages.length === 0) return;

                const id = Date.now().toString();
                // Generate title from first user message if not provided
                const firstUserMsg = messages.find(m => m.role === 'user');
                const generatedTitle = title || (firstUserMsg ? firstUserMsg.content.slice(0, 30) : 'New Chat');

                set((state) => ({
                    sessions: [
                        { id, title: generatedTitle, messages, timestamp: Date.now() },
                        ...state.sessions
                    ]
                }));
            },
            deleteSession: (id) => set((state) => ({
                sessions: state.sessions.filter(s => s.id !== id)
            })),
            clearHistory: () => set({ sessions: [] }),
        }),
        {
            name: 'textie-chat-history',
        }
    )
);
