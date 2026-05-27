import { Song } from "@/types";
import TrackPlayer from "react-native-track-player";
import { showToast } from "./useToastMessage";

const getPlayableUrl = (song: Song) => {
  return song.download_url[song.download_url.length - 1].link;
};

const playAlbum = async (songs: Song[], index: number) => {
  await TrackPlayer.reset();
  await TrackPlayer.setQueue(
    songs.map((song: Song) => ({
      id: song.id,
      title: song.name,
      artist: song.subtitle || "unknown",
      artwork: song.image[song.image.length - 1].link,
      url: getPlayableUrl(song),
      album: song.album,
      album_id: song.album_id,
      duration: song.duration,
      artist_map: song.artist_map,
      release_date: song.release_date,
    }))
  );

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
    url: getPlayableUrl(song),
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
    url: getPlayableUrl(song),
    album: song.album,
    album_id: song.album_id,
    duration: song.duration,
    artist_map: song.artist_map,
    release_date: song.release_date,
  });
  showToast("Song added to queue");
};

const playNext = async (song: Song) => {
  const currentIndex = await TrackPlayer.getActiveTrackIndex();
  if (currentIndex) {
    await TrackPlayer.add(
      {
        id: song.id,
        title: song.name,
        artist: song.subtitle,
        artwork: song.image[song.image.length - 1].link,
        url: getPlayableUrl(song),
        album: song.album,
        album_id: song.album_id,
        duration: song.duration,
        artist_map: song.artist_map,
        release_date: song.release_date,
      },
      currentIndex + 1
    );
  }
  showToast("Song added to queue");
};

export { addSongToQueue, playAlbum, playNext, playSong };
