import { getAudioPreference } from "@/helpers";
import { QUALITY_MAP } from "@/helpers/audioQualityMap";
import { Song } from "@/types";
import { DeviceEventEmitter } from "react-native";
import TrackPlayer from "react-native-track-player";
import { showToast } from "./useToastMessage";

const getPlayableUrl = async (song: Song) => {
  const preference = await getAudioPreference();

  if (!preference) {
    return song.download_url[song.download_url.length - 1].link;
  }

  const quality = QUALITY_MAP[preference.quality as keyof typeof QUALITY_MAP];
  const url =
    song.download_url.find((item) => item.quality == quality)?.link ||
    song.download_url[song.download_url.length - 1].link;

  return url;
};

const playAlbum = async (songs: Song[], index: number) => {
  await TrackPlayer.reset();

  const tracks = await Promise.all(
    songs.map(async (song: Song) => ({
      id: song.id,
      title: song.name,
      artist: song.subtitle || "unknown",
      artwork: song.image[song.image.length - 1].link,
      url: await getPlayableUrl(song),
      album: song.album,
      album_id: song.album_id,
      duration: song.duration,
      artist_map: song.artist_map,
      release_date: song.release_date,
    }))
  );

  await TrackPlayer.setQueue(tracks);

  await TrackPlayer.skip(index);
  await TrackPlayer.play();
};

const playSong = async (song: Song) => {
  await TrackPlayer.reset();

  await TrackPlayer.load({
    id: song.id,
    title: song.name,
    artist: song.subtitle,
    artwork: song.image[song.image.length - 1].link,
    url: await getPlayableUrl(song),
    album: song.album,
    album_id: song.album_id,
    duration: song.duration,
    artist_map: song.artist_map,
    release_date: song.release_date,
  });

  await TrackPlayer.play();
};

const addSongToQueue = async (song: Song) => {
  await TrackPlayer.add({
    id: song.id,
    title: song.name,
    artist: song.subtitle,
    artwork: song.image[song.image.length - 1].link,
    url: await getPlayableUrl(song),
    album: song.album,
    album_id: song.album_id,
    duration: song.duration,
    artist_map: song.artist_map,
    release_date: song.release_date,
  });
  showToast("Song added to queue");
};

const removeFromQueue = async (index: number) => {
  await TrackPlayer.remove([index]);
  showToast("Song removed from queue");
  DeviceEventEmitter.emit("queue_updated");
};

const playNext = async (song: Song) => {
  const currentIndex = await TrackPlayer.getActiveTrackIndex();
  if (currentIndex != null) {
    await TrackPlayer.add(
      {
        id: song.id,
        title: song.name,
        artist: song.subtitle,
        artwork: song.image[song.image.length - 1].link,
        url: await getPlayableUrl(song),
        album: song.album,
        album_id: song.album_id,
        duration: song.duration,
        artist_map: song.artist_map,
        release_date: song.release_date,
      },
      currentIndex + 1
    );
    showToast("Song will play next");
  }
};

export { addSongToQueue, playAlbum, playNext, playSong, removeFromQueue };
