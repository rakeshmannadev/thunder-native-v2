import { setAudioPreference } from "@/helpers";
import { AudioPreferenceType, qualites, Song } from "@/types";
import TrackPlayer from "react-native-track-player";
import { create } from "zustand";

type LoopMode = "off" | "all" | "one";

interface PlayerStore {
  currentSong: Song | null;
  isShuffle: boolean;
  loop: LoopMode;
  queue: Song[];
  originalQueue: Song[]; // Backup for shuffle
  currentIndex: number;
  audioPreference: AudioPreferenceType;

  initializeQueue: (songs: Song[], startIndex?: number) => void;
  playAlbum: (songs: Song[], startIndex: number) => void;
  setCurrentSong: (song: Song | null) => void;
  playQueueIndex: (index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  hasNext: () => boolean;
  setShuffle: (state: boolean) => void;
  setLoop: (mode: LoopMode) => void;
  addToQueue: (songs: Song[]) => void;
  insertToQueue: (song: Song, position: number) => void;
  stopPlayer: () => void;
  setAudioPreference: (pref: Partial<AudioPreferenceType>) => void;
}

const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isShuffle: false,
  loop: "off",
  queue: [],
  originalQueue: [],
  currentIndex: -1,
  audioPreference: {
    downloadFirst: true,
    quality: qualites.medium,
  },

  initializeQueue: (songs: Song[], startIndex: number = 0) => {
    set({
      queue: songs,
      originalQueue: [],
      currentIndex: startIndex,
      isShuffle: false,
      loop: "off",
    });
  },
  addToQueue(songs: Song[]) {
    const { isShuffle, queue, originalQueue } = get();
    if (isShuffle) {
      set({
        queue: [...queue, ...songs],
        originalQueue: [...originalQueue, ...songs],
      });
    } else {
      set({ queue: [...queue, ...songs] });
    }
  },
  insertToQueue(song: Song, position: number) {
    const { isShuffle, queue, originalQueue } = get();
    const newQueue = [...queue];

    let targetPos = position;
    if (targetPos < 0 || targetPos > newQueue.length) {
      targetPos = newQueue.length;
    }
    newQueue.splice(targetPos, 0, song);

    const newOriginalQueue = isShuffle ? [...originalQueue, song] : originalQueue;
    set({
      queue: newQueue,
      originalQueue: isShuffle ? newOriginalQueue : originalQueue,
    });
  },
  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;
    set({
      queue: songs,
      originalQueue: [],
      isShuffle: false,
      currentSong: songs[startIndex],
      currentIndex: startIndex,
    });
  },
  setCurrentSong: (song: Song | null) => {
    if (!song) return;
    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },
  playQueueIndex: (index: number) => {
    const { queue } = get();
    if (index >= 0 && index < queue.length) {
      set({
        currentSong: queue[index],
        currentIndex: index,
      });
    }
  },
  playNext: () => {
    const { currentIndex, queue, isShuffle, loop } = get();
    let nextIndex: number;

    if (loop === "one") {
      nextIndex = currentIndex % queue.length;
    } else if (isShuffle) {
      do {
        nextIndex = Math.floor(Math.random() * queue.length);
      } while (nextIndex === currentIndex && queue.length > 1);
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex < queue.length) {
      set({ currentSong: queue[nextIndex], currentIndex: nextIndex });
    } else if (loop === "all" && queue.length > 0) {
      set({ currentSong: queue[0], currentIndex: 0 });
    }
    // If no next and no loop — do nothing; RNTP state already reflects stopped
  },
  playPrevious: () => {
    const { currentIndex, queue, loop } = get();
    if (!queue || queue.length === 0) return;

    let previousIndex = currentIndex - 1;
    if (loop === "all" && previousIndex < 0) {
      previousIndex = queue.length - 1;
    }

    if (previousIndex >= 0) {
      set({ currentSong: queue[previousIndex], currentIndex: previousIndex });
    }
  },
  hasNext: () => {
    const { currentIndex, queue, loop } = get();
    return currentIndex < queue.length - 1 || loop === "all";
  },
  setShuffle: (state) => {
    const { isShuffle, queue, originalQueue, currentSong } = get();
    if (state === isShuffle) return;

    if (state) {
      const backup = [...queue];
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      const newIndex = currentSong
        ? shuffled.findIndex((s) => s._id === currentSong._id)
        : -1;
      set({
        isShuffle: true,
        queue: shuffled,
        originalQueue: backup,
        currentIndex: newIndex !== -1 ? newIndex : 0,
      });
    } else {
      const restored = originalQueue.length > 0 ? originalQueue : queue;
      const newIndex = currentSong
        ? restored.findIndex((s) => s._id === currentSong._id)
        : 0;
      set({
        isShuffle: false,
        queue: restored,
        originalQueue: [],
        currentIndex: newIndex !== -1 ? newIndex : 0,
      });
    }
  },
  setLoop: (mode) => {
    set({ loop: mode });
  },
  stopPlayer: () => {
    TrackPlayer.reset();
    set({ currentSong: null, currentIndex: -1 });
  },
  setAudioPreference: async (pref) => {
    const currentPref = get().audioPreference;
    set({ audioPreference: { ...currentPref, ...pref } });
    await setAudioPreference({ ...currentPref, ...pref });
  },
}));

export default usePlayerStore;
