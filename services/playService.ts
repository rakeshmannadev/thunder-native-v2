import TrackPlayer, { Capability } from "react-native-track-player";

export const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
    });
  } catch (error) {
    console.error("Failed to setup player:", error);
  }
};

// Updated cleanup function
export const cleanupPlayer = async () => {
  try {
    // Stop playback and remove all tracks from the queue
    await TrackPlayer.reset();
  } catch (error) {
    console.error("Failed to cleanup player:", error);
  }
};
