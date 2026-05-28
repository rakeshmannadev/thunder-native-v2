import {
  addSongToPlaylist,
  createPlaylist,
  saveRecentlyPlayed,
} from "@/services/userServices";
import { Song } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "./useToastMessage";

const useSongOperations = () => {
  const queryClient = useQueryClient();
  const addToPlaylistMutation = useMutation({
    mutationFn: ({
      id,
      song,
      playlistName,
      imageUrl,
      artists,
    }: {
      id: string | null;
      song: Song;
      playlistName: string;
      imageUrl: string;
      artists: any[];
    }) =>
      addSongToPlaylist({
        id,
        song,
        playListName: playlistName,
        artists: artists,
        imageUrl: imageUrl,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-playlists"] });
      showToast("Song added to playlist");
    },
    onError: (error) => {
      console.log(error);
      showToast("Failed to add song to playlist");
    },
  });
  const createPlaylistMutation = useMutation({
    mutationFn: ({
      name,
      image,
      artists,
      songs,
    }: {
      name: string;
      image: string | undefined;
      artists: any[];
      songs: Song[];
    }) => createPlaylist({ name, artists, songs, image }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-playlists"] });
      showToast("Playlist created successfully");
    },
    onError: (error) => {
      console.log(error);
      showToast("Failed to create playlist");
    },
  });

  const saveRecentlyPlayedMutation = useMutation({
    mutationFn: (song: Song) => saveRecentlyPlayed(song),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recently-played"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return {
    addToPlaylistMutation,
    createPlaylistMutation,
    saveRecentlyPlayedMutation,
  };
};

export default useSongOperations;
