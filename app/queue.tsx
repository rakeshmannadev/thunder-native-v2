import QueueScreen from "@/components/songs/QueueScreen";
import { useActiveTrack } from "react-native-track-player";

export default function QueueRoute() {
  const activeTrack = useActiveTrack();

  return <QueueScreen imageUrl={activeTrack?.artwork} />;
}
