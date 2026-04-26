import { Artist, Song } from "@/types";
import TrackPlayer from "react-native-track-player";

const playAlbum = async (songs: Song[], index: number) => {
  await TrackPlayer.reset();
  await TrackPlayer.setQueue(
    songs.map((song: Song) => ({
      id: song._id,
      title: song.title,
      artist: song.artists.primary
        .map((artist: Artist) => artist.name)
        .join(", "),
      artwork: song.imageUrl,
      url: song.audioUrl,
    }))
  );

  await TrackPlayer.skip(index);
  await TrackPlayer.play();
};

const playSong = async (song: Partial<Song>) => {
  await TrackPlayer.load({
    id: song?._id ?? song.id,
    title: song.title,
    artist:
      song?.artists?.primary?.map((artist: Artist) => artist.name).join(", ") ||
      "",
    artwork: song?.imageUrl,
    url: song?.audioUrl || "",
  });

  await TrackPlayer.play();
};

const addSongToQueue = async (song: Song) => {
  await TrackPlayer.add({
    id: song._id,
    title: song.title,
    artist: song.artists.primary
      .map((artist: Artist) => artist.name)
      .join(", "),
    artwork: song.imageUrl,
    url: song.audioUrl,
  });
};

const playNext = async (song: Song) => {
  const currentIndex = await TrackPlayer.getActiveTrackIndex();
  if (currentIndex) {
    await TrackPlayer.add(
      {
        id: song._id,
        title: song.title,
        artist: song.artists.primary
          .map((artist: Artist) => artist.name)
          .join(", "),
        artwork: song.imageUrl,
        url: song.audioUrl,
      },
      currentIndex + 1
    );
  }
};

export { addSongToQueue, playAlbum, playNext, playSong };
