import usePlayerStore from "@/store/usePlayerStore";
import {
  AudioPlayer,
  AudioStatus,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";

type audiocontext = {
  player: AudioPlayer;
  status: AudioStatus;
};
const PlayerContext = createContext<audiocontext | undefined>(undefined);

export default function PlayerProvider({ children }: PropsWithChildren) {
  const { currentSong, playNext, hasNext } = usePlayerStore();
  const player = useAudioPlayer(
    { uri: currentSong?.audioUrl },
    { downloadFirst: true }
  );
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (!status) return;
    if (status.didJustFinish) {
      player.seekTo(0);
      if (hasNext()) {
        playNext();
      } else {
        player.pause();
      }
    }
  }, [status.didJustFinish]);

  useEffect(() => {
    if (player && currentSong && status.isLoaded) {
      (async () => {
        try {
          player.play();
        } catch (err) {
          console.error("Failed to autoplay:", err);
        }
      })();
    }
  }, [status.isLoaded]);

  return (
    <PlayerContext.Provider value={{ player, status }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
