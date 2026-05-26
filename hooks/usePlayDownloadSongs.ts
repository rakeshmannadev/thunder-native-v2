import { DownloadedSong } from "@/types";
import TrackPlayer from "react-native-track-player";

export const usePlayDownloadSongs = () => {
  const playAlbum = async (songs: DownloadedSong[], index: number = 0) => {
    await TrackPlayer.reset();
    await TrackPlayer.setQueue(
      songs.map((song) => ({
        id: song.id,
        title: song.title,
        artist: song.artist || "Unknown Artist",
        artwork: song.artwork,
        url: song.localUri || song.url,
        duration: song.duration,
      }))
    );

    await TrackPlayer.skip(index);
    await TrackPlayer.play();
  };

  const playSong = async (song: DownloadedSong) => {
    await TrackPlayer.reset();
    await TrackPlayer.load({
      id: song.id,
      title: song.title,
      artist: song.artist || "Unknown Artist",
      artwork: song.artwork,
      url: song.localUri || song.url,
      duration: song.duration,
    });
    await TrackPlayer.play();
  };

  const shuffleSong = async (songs: DownloadedSong[]) => {
    if (songs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * songs.length);
    await playAlbum(songs, randomIndex);
  };

  return { playSong, playAlbum, shuffleSong };
};
