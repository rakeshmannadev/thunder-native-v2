import usePlayerStore from "@/store/usePlayerStore";
import {
  AudioPlayer,
  AudioStatus,
  setAudioModeAsync,
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
  const {
    currentSong,
    playNext,
    hasNext,
    audioPreference,
    loop,
    setIsPlaying,
  } = usePlayerStore();

  const player = useAudioPlayer(
    { uri: currentSong?.audioUrl },
    { downloadFirst: audioPreference.downloadFirst }
  );

  const status = useAudioPlayerStatus(player);

  // * Set audio mode to play in background and silent mode
  useEffect(() => {
    (async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionModeAndroid: "doNotMix",
          interruptionMode: "doNotMix",
          shouldRouteThroughEarpiece: true,
        });
      } catch (error) {
        console.log("Error while setting audio mode:", error);
      }
    })();
  }, [player]);

  // * Sync isPlaying state with store
  useEffect(() => {
    if (status) {
      setIsPlaying(status.playing);
    }
  }, [status.playing]);

  // * Auto play next song when current song finishes
  useEffect(() => {
    if (!status) return;
    if (status.didJustFinish) {
      if (loop === "one") {
        player.seekTo(0);
        player.play();
        return;
      }
      if (hasNext()) {
        playNext();
      } else {
        player.pause();
      }
    }
  }, [status.didJustFinish]);

  // * Auto play when a new song is loaded
  useEffect(() => {
    if (player && currentSong && status.isLoaded) {
      try {
        player.play();
      } catch (err) {
        console.error("Failed to autoplay:", err);
      }
    }
  }, [status.isLoaded, currentSong]);

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
