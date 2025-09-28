import usePlayerStore from "@/store/usePlayerStore";
import { AudioPlayer, useAudioPlayer } from "expo-audio";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";

type audiocontext = {
  player: AudioPlayer;
};
const PlayerContext = createContext<audiocontext | undefined>(undefined);

export default function PlayerProvider({ children }: PropsWithChildren) {
  const { currentSong, playNext, hasNext } = usePlayerStore();
  const player = useAudioPlayer(
    { uri: currentSong?.audioUrl },
    { downloadFirst: true }
  );

  useEffect(() => {
    if (!player) return;

    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        if (status.didJustFinish) {
          if (hasNext()) {
            playNext();
          } else {
            player.pause();
          }
        }
      }
    );

    return () => subscription.remove();
  }, [player, playNext, hasNext]);

  useEffect(() => {
    if (player && currentSong?.audioUrl) {
      (async () => {
        try {
          player.replace({ uri: currentSong.audioUrl });
          player.play();
        } catch (err) {
          console.error("Failed to autoplay:", err);
        }
      })();
    }
  }, [currentSong?.audioUrl]);

  return (
    <PlayerContext.Provider value={{ player }}>
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
