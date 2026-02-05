import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: number;
}

interface SearchStore {
  recentSearches: SearchHistory[];
  addSearch: (query: string) => void;
  removeSearch: (id: string) => void;
  clearHistory: () => void;
  getRecentSearches: (limit?: number) => SearchHistory[];
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      recentSearches: [],

      addSearch: (query: string) => {
        const trimmedQuery = query.trim().toLowerCase();
        if (!trimmedQuery) return;

        set((state) => {
          // Remove if already exists
          const filtered = state.recentSearches.filter(
            (s) => s.query.toLowerCase() !== trimmedQuery
          );

          // Add to beginning
          const newSearch: SearchHistory = {
            id: Date.now().toString(),
            query: trimmedQuery,
            timestamp: Date.now(),
          };

          return {
            recentSearches: [newSearch, ...filtered].slice(0, 10), // Keep only 10 recent
          };
        });
      },

      removeSearch: (id: string) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s.id !== id),
        }));
      },

      clearHistory: () => {
        set({ recentSearches: [] });
      },

      getRecentSearches: (limit = 10) => {
        return get().recentSearches.slice(0, limit);
      },
    }),
    {
      name: 'search-history',
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
    }
  )
);
