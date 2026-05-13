import TrackPlayer, { Event, State } from "react-native-track-player";

import { showToast } from "@/hooks/useToastMessage";

export const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    try {
      await TrackPlayer.play();
    } catch (e: any) {
      showToast("Play error: " + e.message);
    }
  });

  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    try {
      await TrackPlayer.pause();
    } catch (e: any) {
      console.log("Pause error: " + e.message);
      showToast("Pause error: " + e.message);
    }
  });

  TrackPlayer.addEventListener(Event.RemotePlayPause, async () => {
    try {
      const state = await TrackPlayer.getPlaybackState();
      if (state.state === State.Playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (e: any) {
      showToast("PlayPause error: " + e.message);
    }
  });

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    try {
      await TrackPlayer.stop();
    } catch (e: any) {
      showToast("Stop error: " + e.message);
    }
  });

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    showToast("RemoteNext Triggered!");
    try {
      await TrackPlayer.skipToNext();
    } catch (e: any) {
      showToast("Next error: " + e.message);
    }
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    showToast("RemotePrevious Triggered!");
    try {
      await TrackPlayer.skipToPrevious();
    } catch (e: any) {
      showToast("Prev error: " + e.message);
    }
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
    try {
      await TrackPlayer.seekTo(event.position);
    } catch (e: any) {
      showToast("Seek error: " + e.message);
    }
  });
};
