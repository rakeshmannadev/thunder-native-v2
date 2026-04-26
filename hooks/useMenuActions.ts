import usePlayerStore from "@/store/usePlayerStore";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Song } from "@/types";
import { useRouter } from "expo-router";
import { Appearance } from "react-native";
import { showToast } from "./useToastMessage";
import { addSongToQueue, playNext } from "./useTrackPlayerActions";

const useMenuActions = () => {
  const router = useRouter();
  const { addToQueue, currentIndex, insertToQueue, setAudioPreference } =
    usePlayerStore();
  const { startBroadcast, endBroadcast, deleteRoom, leaveRoom } =
    useSocketStore();
  const { currentUser } = useUserStore();
  const { currentRoom, leaveJoinedRoom } = useRoomStore();

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
      case "download_first":
        setAudioPreference({ downloadFirst: true });

        break;
      case "streaming":
        setAudioPreference({ downloadFirst: false });

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

      default:
        break;
    }
  };

  return { handleMenuActions };
};

export default useMenuActions;
