import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const MAX_RECENT_SEARCHES = 10;

interface SearchStore {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      recentSearches: [],

      addRecentSearch: (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        set((state) => {
          // Remove duplicate (case-insensitive), then prepend
          const filtered = state.recentSearches.filter(
            (s) => s.toLowerCase() !== trimmed.toLowerCase()
          );
          return {
            recentSearches: [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES),
          };
        });
      },

      removeRecentSearch: (query: string) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== query),
        }));
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },
    }),
    {
      name: "thunder-search-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);

export default useSearchStore;
