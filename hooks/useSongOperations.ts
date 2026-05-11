import { addSongToPlaylist, createPlaylist } from "@/services/userServices";
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
      queryClient.invalidateQueries({ queryKey: ["user-playlist"] });
      showToast("Song added to playlist");
    },
    onError: (error) => {
      console.log(error);
      showToast("Failed to add song to playlist");
    },
  });
  const createPlaylistMutation = useMutation({
    mutationFn: createPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-playlist"] });
      showToast("Playlist created successfully");
    },
    onError: (error) => {
      console.log(error);
      showToast("Failed to create playlist");
    },
  });

  return { addToPlaylistMutation, createPlaylistMutation };
};

export default useSongOperations;
