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

  // * Synchronize player play/pause state with store and broadcasting
  useEffect(() => {
    if (!player) return;

    const syncPlayerState = async () => {
      // Priority 1: Broadcasting sync
      if (isBroadcasting) {
        // Sync time if difference is significant (> 500ms)
        const diff = Math.abs(player.currentTime - currentTime);
        if (diff > 500) {
          player.seekTo(currentTime);
        }

        if (isPlayingSong) {
          player.play();
        } else {
          player.pause();
        }
        return;
      }

      // Priority 2: Store isPlaying sync
      // We only apply this if we are not broadcasting
      // If store says playing but player is paused, play (and vice versa)
      if (usePlayerStore.getState().isPlaying) {
        player.play();
      } else {
        player.pause();
      }
    };

    syncPlayerState();
  }, [isPlayingSong, isBroadcasting, currentTime, player, usePlayerStore.getState().isPlaying]);

  // * Handle song end / loop / next
  useEffect(() => {
    if (!status || !status.didJustFinish) return;

    const handleFinish = async () => {
      if (loop === "one") {
        await player.seekTo(0);
        player.play();
        return;
      }

      if (hasNext()) {
        playNext();
      } else {
        usePlayerStore.getState().setIsPlaying(false);
      }
    };

    handleFinish();
  }, [status?.didJustFinish, player, loop, playNext, hasNext]);

  // * Handle song change and autoplay
  useEffect(() => {
    if (player && currentSong && status.isLoaded) {
      // When a new song is loaded and isLoaded becomes true, ensure it plays if store says so
      if (usePlayerStore.getState().isPlaying) {
        player.play();
      }
    }
  }, [status.isLoaded, currentSong?.audioUrl, player]);

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
