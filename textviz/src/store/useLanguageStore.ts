import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Language, translations, Translations } from '@/lib/i18n/translations';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'ko' as Language,
      t: translations['ko'],
      setLanguage: (language: Language) => {
        set({
          language,
          t: translations[language]
        });
      },
    }),
    {
      name: 'textviz-language-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = translations[state.language];
        }
      },
    }
  )
);
