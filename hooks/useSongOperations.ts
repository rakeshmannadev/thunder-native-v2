import {
  addSongToPlaylist,
  createPlaylist,
  deletePlaylist,
  removeFromFavorites,
  saveRecentlyPlayed,
} from "@/services/userServices";
import { Playlist, Song } from "@/types";
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

  const deletePlaylistMutation = useMutation({
    mutationFn: (playlistId: string) => deletePlaylist(playlistId),
    onMutate: async (playlistId: string) => {
      await queryClient.cancelQueries({ queryKey: ["user-playlists"] });
      const previousPlaylists = queryClient.getQueryData<Playlist[]>(["user-playlists"]);
      queryClient.setQueryData<Playlist[]>(["user-playlists"], (old) =>
        old ? old.filter((p) => p._id !== playlistId) : []
      );
      return { previousPlaylists };
    },
    onError: (_err: any, _id: string, context: any) => {
      if (context?.previousPlaylists) {
        queryClient.setQueryData(["user-playlists"], context.previousPlaylists);
      }
      showToast("Failed to delete playlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-playlists"] });
    },
    onSuccess: () => {
      showToast("Playlist deleted");
    },
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: (songId: string) => removeFromFavorites(songId),
    onMutate: async (songId: string) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previousFavorites = queryClient.getQueryData<Song[]>(["favorites"]);
      queryClient.setQueryData<Song[]>(["favorites"], (old) =>
        old ? old.filter((s) => s.id !== songId) : []
      );
      return { previousFavorites };
    },
    onError: (_err: any, _id: string, context: any) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }
      showToast("Failed to remove from favorites");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onSuccess: () => {
      showToast("Removed from favorites");
    },
  });

  const removeSavedAlbumMutation = useMutation({
    mutationFn: (albumId: string) => deletePlaylist(albumId),
    onMutate: async (albumId: string) => {
      await queryClient.cancelQueries({ queryKey: ["saved-albums"] });
      const previousAlbums = queryClient.getQueryData<Playlist[]>(["saved-albums"]);
      queryClient.setQueryData<Playlist[]>(["saved-albums"], (old) =>
        old ? old.filter((a) => (a._id || a.id) !== albumId) : []
      );
      return { previousAlbums };
    },
    onError: (_err: any, _id: string, context: any) => {
      if (context?.previousAlbums) {
        queryClient.setQueryData(["saved-albums"], context.previousAlbums);
      }
      showToast("Failed to remove album");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-albums"] });
    },
    onSuccess: () => {
      showToast("Album removed from library");
    },
  });

  return {
    addToPlaylistMutation,
    createPlaylistMutation,
    saveRecentlyPlayedMutation,
    deletePlaylistMutation,
    removeFromFavoritesMutation,
    removeSavedAlbumMutation,
  };
};

export default useSongOperations;
