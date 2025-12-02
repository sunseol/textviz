import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'textviz-app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
