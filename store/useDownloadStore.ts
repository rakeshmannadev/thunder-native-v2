import { DownloadedSong } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ActiveDownload {
  progress: number;
  status: "downloading" | "paused" | "failed" | "completed";
}

interface DownloadStore {
  downloadedSongs: Record<string, DownloadedSong>;
  activeDownloads: Record<string, ActiveDownload>;
  setDownloadedSong: (songId: string, data: DownloadedSong) => void;
  removeDownloadedSong: (songId: string) => void;
  setActiveDownload: (songId: string, state: Partial<ActiveDownload>) => void;
  removeActiveDownload: (songId: string) => void;
}

export const useDownloadStore = create<DownloadStore>()(
  persist(
    (set) => ({
      downloadedSongs: {},
      activeDownloads: {},
      setDownloadedSong: (songId, data) =>
        set((state) => ({
          downloadedSongs: { ...state.downloadedSongs, [songId]: data },
        })),
      removeDownloadedSong: (songId) =>
        set((state) => {
          const next = { ...state.downloadedSongs };
          delete next[songId];
          return { downloadedSongs: next };
        }),
      setActiveDownload: (songId, partialState) =>
        set((state) => ({
          activeDownloads: {
            ...state.activeDownloads,
            [songId]: {
              ...(state.activeDownloads[songId] || {
                progress: 0,
                status: "downloading",
              }),
              ...partialState,
            },
          },
        })),
      removeActiveDownload: (songId) =>
        set((state) => {
          const next = { ...state.activeDownloads };
          delete next[songId];
          return { activeDownloads: next };
        }),
    }),
    {
      name: "thunder-download-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ downloadedSongs: state.downloadedSongs }),
    }
  )
);

export default useDownloadStore;
