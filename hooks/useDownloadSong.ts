import { useDownloadStore } from "@/store/useDownloadStore";
import usePlayerStore from "@/store/usePlayerStore";
import { DownloadedSong } from "@/types";
import * as FileSystem from "expo-file-system/legacy";
import { showToast } from "./useToastMessage";

const DOWNLOADS_DIR = `${FileSystem.documentDirectory}downloads/`;

export const useDownloadSong = () => {
  const { audioPreference } = usePlayerStore();
  const {
    downloadedSongs,
    activeDownloads,
    setDownloadedSong,
    removeDownloadedSong,
    setActiveDownload,
    removeActiveDownload,
  } = useDownloadStore();

  const ensureDownloadsDir = async () => {
    const dirInfo = await FileSystem.getInfoAsync(DOWNLOADS_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(DOWNLOADS_DIR, {
        intermediates: true,
      });
    }
  };

  const getDownloadUrl = (song: DownloadedSong) => {
    return song.url;
  };

  const downloadSong = async (song: DownloadedSong) => {
    if (!song) return;

    if (downloadedSongs[song.id]) {
      showToast("Song is already downloaded");
      return;
    }

    if (activeDownloads[song.id]?.status === "downloading") {
      showToast("Download already in progress");
      return;
    }

    const downloadUrl = getDownloadUrl(song);
    if (!downloadUrl) {
      showToast("Download URL not found");
      return;
    }

    try {
      await ensureDownloadsDir();

      const fileExtension =
        downloadUrl.split(".").pop()?.split("?")[0] || "mp3";
      const filename = `${song.id}.${fileExtension}`;
      const localUri = `${DOWNLOADS_DIR}${filename}`;

      setActiveDownload(song.id, { progress: 0, status: "downloading" });
      showToast(`Downloading: ${song.title}`);

      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        localUri,
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          setActiveDownload(song.id, { progress, status: "downloading" });
        }
      );

      const result = await downloadResumable.downloadAsync();

      if (result && result.uri) {
        setDownloadedSong(song.id, {
          ...song,
          localUri: result.uri,
          downloadedAt: Date.now(),
        });
        setActiveDownload(song.id, { progress: 1, status: "completed" });
        setTimeout(() => removeActiveDownload(song.id), 1000);
        showToast(`Downloaded: ${song.title}`);
      } else {
        throw new Error("Download failed, no URI returned");
      }
    } catch (error) {
      console.error("Error downloading song:", error);
      setActiveDownload(song.id, { status: "failed" });
      showToast("Download failed");
    }
  };

  const deleteDownload = async (songId: string) => {
    const song = downloadedSongs[songId];
    if (!song) return;

    try {
      const fileInfo = await FileSystem.getInfoAsync(song.localUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(song.localUri);
      }
      removeDownloadedSong(songId);
      showToast("Download deleted");
    } catch (error) {
      console.error("Error deleting downloaded song:", error);
      showToast("Failed to delete download");
    }
  };

  return {
    downloadSong,
    deleteDownload,
    isDownloaded: (songId: string) => !!downloadedSongs[songId],
    getDownloadProgress: (songId: string) =>
      activeDownloads[songId]?.progress || 0,
    isDownloading: (songId: string) =>
      activeDownloads[songId]?.status === "downloading",
    downloadedSongsList: Object.values(downloadedSongs),
  };
};

export default useDownloadSong;
