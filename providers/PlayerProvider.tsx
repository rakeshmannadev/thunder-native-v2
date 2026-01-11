import usePlayerStore from "@/store/usePlayerStore";
import useSocketStore from "@/store/useSocketStore";
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
  const { currentSong, playNext, hasNext, audioPreference, loop } =
    usePlayerStore();
  const { isBroadcasting, isPlayingSong, currentTime } = useSocketStore();

  const player = useAudioPlayer(
    { uri: currentSong?.audioUrl },
    { downloadFirst: audioPreference.downloadFirst }
  );

  const status = useAudioPlayerStatus(player);

  // * while broadcasting control the seek event
  useEffect(() => {
    if (isBroadcasting) {
      player.seekTo(currentTime);
    }
  }, [currentTime, isBroadcasting]);

  // * while broadcasting control the play/pause event
  useEffect(() => {
    if (isBroadcasting && isPlayingSong) {
      player.play();
    } else if (isBroadcasting && !isPlayingSong) {
      player.pause();
    }
  }, [isPlayingSong, isBroadcasting]);

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

  // * Auto play next song when current song finishes
  useEffect(() => {
    if (!status) return;
    if (status.didJustFinish) {
      if (loop === "one") {
        player.seekTo(0).then(() => player.play());
        return;
      }
      if (hasNext()) {
        player.pause();
        player.seekTo(0).then(() => playNext());
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
