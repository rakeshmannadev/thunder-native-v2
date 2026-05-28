import { create } from "zustand";

interface MusicStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const useMusicStore = create<MusicStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
}));
export default useMusicStore;
