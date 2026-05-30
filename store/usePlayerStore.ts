import { saveAudioPreference } from "@/helpers";
import { AudioPreferenceType } from "@/types";
import { create } from "zustand";

interface PlayerStore {
  shuffle: boolean;
  setShuffle: (shuffle: boolean) => void;
  audioPreference: AudioPreferenceType;
  setAudioPreference: (pref: Partial<AudioPreferenceType>) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const usePlayerStore = create<PlayerStore>((set, get) => ({
  shuffle: false,
  audioPreference: {
    downloadFirst: true,
    quality: "high",
    autoplay: false,
    repeat: "all",
    shuffle: false,
  },
  setShuffle: (shuffle) => {
    set({ shuffle });
  },
  selectedCategory: "all",
  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category });
  },
  setAudioPreference: async (pref: Partial<AudioPreferenceType>) => {
    const currentPref = get().audioPreference;
    set({ audioPreference: { ...currentPref, ...pref } });
    await saveAudioPreference({
      ...currentPref,
      ...pref,
    } as AudioPreferenceType);
  },
}));

export default usePlayerStore;
