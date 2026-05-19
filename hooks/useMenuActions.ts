import usePlayerStore from "@/store/usePlayerStore";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Playlist, Song } from "@/types";
import { useRouter } from "expo-router";
import { Appearance } from "react-native";
import useSongOperations from "./useSongOperations";
import { showToast } from "./useToastMessage";
import { addSongToQueue, playNext } from "./useTrackPlayerActions";
import useDownloadSong from "./useDownloadSong";

const useMenuActions = () => {
  const router = useRouter();
  const { addToQueue, currentIndex, insertToQueue, setAudioPreference } =
    usePlayerStore();
  const { startBroadcast, endBroadcast, deleteRoom, leaveRoom } =
    useSocketStore();
  const { currentUser } = useUserStore();
  const { currentRoom, leaveJoinedRoom } = useRoomStore();
  const { addToPlaylistMutation } = useSongOperations();
  const { downloadSong, deleteDownload } = useDownloadSong();

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
        showToast("Song added to queue");
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
        if (currentUser && currentRoom) {
          startBroadcast(currentUser?._id, currentRoom?.roomId);
        }
        break;
      case "stop_broadcast":
        if (currentUser && currentRoom) {
          endBroadcast(currentUser?._id, currentRoom?.roomId);
        }
        break;
      case "delete_room":
        deleteRoom(currentUser?._id!, currentRoom?._id!, currentRoom?.roomId!);

        break;
      case "leave_room":
        leaveJoinedRoom(currentRoom?._id!);

        break;
      case "end_session":
        router.push("/rooms");
        leaveRoom(currentRoom?._id!, currentUser?._id!);
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
        }
        break;

      default:
        break;
    }
  };

  return { handleMenuActions };
};

export default useMenuActions;
