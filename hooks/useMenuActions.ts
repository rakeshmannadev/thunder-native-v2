import { getRandomIndex } from "@/helpers/utils";
import { getPlaylistById } from "@/services/songService";
import usePlayerStore from "@/store/usePlayerStore";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Playlist, Song } from "@/types";
import { useRouter } from "expo-router";
import { Appearance } from "react-native";
import TrackPlayer, { useActiveTrack } from "react-native-track-player";
import useDownloadSong from "./useDownloadSong";
import useShare from "./useShare";
import useSongOperations from "./useSongOperations";
import { showToast } from "./useToastMessage";
import {
  addSongToQueue,
  playAlbum,
  playNext,
  removeFromQueue,
} from "./useTrackPlayerActions";

const useMenuActions = () => {
  const { setAudioPreference } = usePlayerStore();
  const { startBroadcast, endBroadcast, deleteRoom, leaveRoom } =
    useSocketStore();
  const { currentUser } = useUserStore();
  const { currentRoom, leaveJoinedRoom } = useRoomStore();
  const currentSong = useActiveTrack();

  const {
    addToPlaylistMutation,
    deletePlaylistMutation,
    removeFromFavoritesMutation,
    removeSavedAlbumMutation,
  } = useSongOperations();
  const { downloadSong, deleteDownload } = useDownloadSong();
  const { handleShare } = useShare();

  const router = useRouter();

  const handleMenuActions = async (action: string, params?: number | any) => {
    switch (action) {
      case "go_to_artist":
        router.push({ pathname: "/artist/[id]", params: { id: params } });
        break;
      case "go_to_album":
        router.push({ pathname: "/album/[id]", params: { id: params } });
        break;
      case "add_to_queue":
        if (!params || !Array.isArray(params)) return;
        const song: Song = params[0];

        addSongToQueue(song);
        showToast("Song added to queue");
        break;
      case "add_to_playlist":
        const {
          song: selectedSong,
          playlist: selectedPlaylist,
        }: { song: Song; playlist: Playlist } = params;

        if (!selectedSong || !selectedPlaylist) return;

        addToPlaylistMutation.mutate({
          id: selectedPlaylist._id,
          song: selectedSong,
          playlistName: selectedPlaylist.playlistName!,
          imageUrl: selectedPlaylist.imageUrl!,
          artists: selectedSong.artist_map.primary_artists,
        });

        break;
      case "play_next":
        if (!params) return;
        const songToPlayNext: Song = params;
        playNext(songToPlayNext);
        break;
      case "light":
        Appearance.setColorScheme("light");
        break;
      case "dark":
        Appearance.setColorScheme("dark");
        break;
      case "low":
        setAudioPreference({ quality: "low" });
        break;
      case "medium":
        setAudioPreference({ quality: "medium" });
        break;
      case "high":
        setAudioPreference({ quality: "high" });
        break;
      case "start_broadcast":
        const roomId = params;
        if (currentUser && roomId) {
          startBroadcast(currentUser?._id, roomId);
        }
        break;
      case "stop_broadcast":
        const stopRoomId = params;
        if (currentUser && stopRoomId) {
          endBroadcast(currentUser?._id, stopRoomId);
        }
        break;
      case "delete_room":
        const { roomId: delRoomId, id: delId } = params;
        if (currentUser && delRoomId && delId) {
          deleteRoom(currentUser?._id!, delId, delRoomId);
        }

        break;
      case "leave_room":
        leaveJoinedRoom(currentRoom?._id!);

        break;
      case "end_session":
        router.push("/rooms");
        leaveRoom(currentUser?._id!, currentRoom?._id!);
        break;
      case "request_song":
        router.push("/search");
        break;
      case "download":
        if (params) {
          downloadSong(params);
        }
        break;
      case "delete_download":
        if (params) {
          deleteDownload(params);

          if (currentSong?.id == params) {
            await TrackPlayer.reset();
          }
        }
        break;
      case "share":
        const songToShare = params as Song;
        handleShare(songToShare);
        break;
      case "delete-playlist":
        if (params) {
          deletePlaylistMutation.mutate(params as string);
        }
        break;
      case "remove-from-favorites":
        if (params) {
          removeFromFavoritesMutation.mutate(params as string);
        }
        break;
      case "remove-saved-album":
        if (params) {
          removeSavedAlbumMutation.mutate(params as string);
        }
      case "play-playlist":
        const playlistId: string = params;
        const playlist = await getPlaylistById({ id: playlistId, link: "" });
        playAlbum(playlist?.songs || [], 0);
        showToast("Playing playlist");
        break;
      case "shuffle":
        const shuffleId: string = params;
        const shufflePlaylist = await getPlaylistById({
          id: shuffleId,
          link: "",
        });
        playAlbum(shufflePlaylist?.songs || [], getRandomIndex());
        showToast("Playing shuffled playlist");
        break;
      case "remove_from_queue":
        const index = params;
        if (index) {
          removeFromQueue(Number(index));
        }
        showToast("Song removed from queue");
        break;
      default:
        break;
    }
  };

  return { handleMenuActions };
};

export default useMenuActions;
