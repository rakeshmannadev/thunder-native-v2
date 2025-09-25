import { Song } from "@/types";

export function songToTrack(song: Song) {
  return {
    id: song.songId,
    url: song.audioUrl,
    title: song.title,
    artist: song.artists.primary.map((a) => a.name).join(", "),
    artwork: song.imageUrl,
  };
}
