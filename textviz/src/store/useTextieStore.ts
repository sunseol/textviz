import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'developer' | 'designer' | 'pm' | 'student' | 'researcher' | 'writer' | 'other';
export type TonePreference = 'polite' | 'casual' | 'professional' | 'friendly' | 'concise';
export type LanguagePreference = 'ko' | 'en';

export interface UserProfile {
    name: string;
    role: UserRole;
    customRole?: string; // If role is 'other'
    tone: TonePreference;
    language: LanguagePreference;
    expertise: string[]; // e.g. ["React", "TypeScript", "UI/UX"]
    avoid: string[]; // e.g. ["Too much jargon", "Passive voice"]
}

export interface TextieState {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggleOpen: () => void;

    userProfile: UserProfile;
    updateUserProfile: (profile: Partial<UserProfile>) => void;

    // Session context (non-persistent, short-term memory for the current session)
    sessionContext: {
        lastAction?: string;
        suggestedActions: string[];
    };
    setSessionContext: (context: Partial<TextieState['sessionContext']>) => void;
}

export const useTextieStore = create<TextieState>()(
    persist(
        (set) => ({
            isOpen: false,
            setIsOpen: (isOpen) => set({ isOpen }),
            toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

            userProfile: {
                name: 'User',
                role: 'developer',
                tone: 'polite',
                language: 'ko',
                expertise: [],
                avoid: [],
            },
            updateUserProfile: (profile) =>
                set((state) => ({
                    userProfile: { ...state.userProfile, ...profile },
                })),

            sessionContext: {
                suggestedActions: [],
            },
            setSessionContext: (context) =>
                set((state) => ({
                    sessionContext: { ...state.sessionContext, ...context },
                })),
        }),
        {
            name: 'textie-storage', // unique name for local storage
            partialize: (state) => ({
                // Only persist user preferences, not UI state like isOpen if we want it closed by default
                userProfile: state.userProfile
            }),
        }
    )
);
