import { setAudioPreference } from "@/helpers";
import { AudioPreferenceType, qualites, Song } from "@/types";
import { create } from "zustand";

type LoopMode = "off" | "all" | "one";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  isShuffle: boolean;
  loop: LoopMode;
  queue: Song[];
  originalQueue: Song[]; // Backup for shuffle
  currentIndex: number;
  audioPreference: AudioPreferenceType;

  initializeQueue: (songs: Song[], startIndex?: number) => void;
  playAlbum: (songs: Song[], startIndex: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setIsPlaying: (state: boolean) => void;
  hasNext: () => boolean;
  setShuffle: (state: boolean) => void;
  setLoop: (mode: LoopMode) => void;
  addToQueue: (songs: Song[]) => void;
  insertToQueue: (song: Song, position: number) => void;
  setAudioPreference: (pref: Partial<AudioPreferenceType>) => void;
}

const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
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
      originalQueue: [], // Reset backup
      currentIndex: startIndex,
      isShuffle: false, // Reset shuffle on new queue init
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
      set({
        queue: [...queue, ...songs],
      });
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

    // If shuffled, append to originalQueue to maintain it
    let newOriginalQueue = originalQueue;
    if (isShuffle) {
      newOriginalQueue = [...originalQueue, song];
    }

    set({
      queue: newQueue,
      originalQueue: isShuffle ? newOriginalQueue : originalQueue,
    });
  },
  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];

    set({
      queue: songs,
      originalQueue: [],
      isShuffle: false,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },
  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const songIndex = get().queue.findIndex((s) => s._id === song._id);

    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },
  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;
    set({
      isPlaying: willStartPlaying,
    });
  },
  playNext: () => {
    const { currentIndex, queue, loop } = get();

    let nextIndex = currentIndex + 1;

    // Handle wrap-around for 'loop all'
    if (loop === "all" && nextIndex >= queue.length) {
      nextIndex = 0;
    }

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      // End of queue and no loop
      set({ isPlaying: false });
    }
  },
  playPrevious: () => {
    const { currentIndex, queue, loop } = get();
    if (!queue || queue.length === 0) {
      set({ isPlaying: false });
      return;
    }

    let previousIndex = currentIndex - 1;

    // Loop all behavior on previous
    if (loop === "all" && previousIndex < 0) {
      previousIndex = queue.length - 1;
    }

    if (previousIndex >= 0) {
      const prevSong = queue[previousIndex];
      set({
        currentSong: prevSong,
        currentIndex: previousIndex,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });
    }
  },
  hasNext: () => {
    const { currentIndex, queue, loop } = get();
    return currentIndex < queue.length - 1 || loop === "all";
  },
  setIsPlaying: (state) => {
    set({ isPlaying: state });
  },
  setShuffle: (state) => {
    const { isShuffle, queue, originalQueue, currentSong } = get();
    if (state === isShuffle) return;

    if (state) {
      // Enable Shuffle
      const currentQueue = [...queue];
      const backup = [...currentQueue];

      const shuffled = currentQueue.sort(() => Math.random() - 0.5);
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
      // Disable Shuffle
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
  setAudioPreference: async (pref) => {
    const currentPref = get().audioPreference;
    set({ audioPreference: { ...currentPref, ...pref } });
    await setAudioPreference({ ...currentPref, ...pref });
  },
}));

export default usePlayerStore;
