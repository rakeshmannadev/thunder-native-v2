import usePlayerStore from "@/store/usePlayerStore";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "expo-router";
import { Appearance } from "react-native";

const useMenuActions = () => {
  const router = useRouter();
  const { addToQueue, currentIndex, insertToQueue, setAudioPreference } =
    usePlayerStore();
  const { startBroadcast } = useSocketStore();
  const { currentUser } = useUserStore();
  const { currentRoom } = useRoomStore();

  const handleMenuActions = (action: string, params?: number | any) => {
    switch (action) {
      case "go_to_artist":
        router.push({ pathname: "/artist/[id]", params: { id: params } });
        break;
      case "go_to_album":
        router.push({ pathname: "/album/[id]", params: { id: params } });
        break;
      case "add_to_queue":
        if (params && Array.isArray(params)) {
          addToQueue(params);
        }
        router.back();
        break;
      case "play_next":
        if (params) {
          insertToQueue(params, currentIndex + 1);
        }
        router.back();
        break;
      case "light":
        Appearance.setColorScheme("light");
        router.back();
        break;
      case "dark":
        Appearance.setColorScheme("dark");
        router.back();
        break;
      case "download_first":
        setAudioPreference({ downloadFirst: true });
        router.back();
        break;
      case "streaming":
        setAudioPreference({ downloadFirst: false });
        router.back();
        break;
      case "start_broadcast":
        if (currentUser && currentRoom) {
          startBroadcast(currentUser?._id, currentRoom?.roomId);
        }
        break;
      default:
        break;
    }
  };

  return { handleMenuActions };
};

export default useMenuActions;
